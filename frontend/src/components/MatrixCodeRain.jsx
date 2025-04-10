import { useEffect, useRef } from "react";
import janvas from "janvas";

const MatrixCodeRain = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        const codeRain = new janvas.Canvas({
            container: canvasRef.current,
            interval: 50,
            props: {
                chars: [],
                fontSize: 0,
                colors: {
                    background: "rgb(0, 0, 0)",
                    head: "rgb(255, 255, 255)",
                    tail: "rgb(0, 255, 0)",
                    saturRange: [60, 90],
                    lightRange: [30, 40],
                    count: 3
                }
            },
            methods: {
                init: function () {
                    this._initChars();
                    this._initColors();
                    this.fontSize = this.fontSize || Math.ceil(this.$width / 120);
                    this.font = "bold " + this.fontSize + "px sans-serif";
                    this.offsetY = janvas.Utils.measureTextWidth("M", this.font);
                    this.halfY = this.offsetY / 2;
                    this.background = new janvas.Rect(this.$ctx, 0, 0);
                    this.background.getStyle().setFillStyle(this.colors.background);
                    this.heads = [];
                    this.pinMap = {};
                    this.pinStack = [];
                    this.serialIdIndex = 0;
                },
                resize: function () {
                    var w = this.$width, h = this.$height;
                    this.background.setWidth(w).setHeight(h);
                    this.column = Math.floor(w / this.fontSize);
                    this.count = Math.floor(this.column / 4);
                    while (this.heads.length < this.count) {
                        var x = this.getRandomX(), head = this.getDefaultText();
                        head.init(x, -this.halfY, x, -this.halfY)
                            .getMatrix().setOffsetY(-this.rand(h * 2));
                        head.getStyle().setFillStyle(this.colors.head);
                        head.timespan = this.rand(50, 100, true);
                        head.timestamp = this.timestamp || 0;
                        head.tails = new Array(Math.floor(head.timespan / 2) + 1);
                        head.tails[0] = this.getDefaultText();
                        for (var i = 1; i < head.tails.length; i++) {
                            head.tails[i] = this.getDefaultText();
                            head.tails[i].getStyle().setFillStyle(i < this.colors.count ?
                                this.colors.gradient[i] : this.colors.tail);
                        }
                        this.heads.push(head);
                    }
                    this.heads.length = this.count;
                },
                update: function (timestamp) {
                    this.timestamp = timestamp;
                    this.heads.forEach(function (head) {
                        if (timestamp >= head.timestamp) {
                            head.timestamp += head.timespan;
                            var tails = head.tails, last = tails[tails.length - 1];
                            if (this.inBackground(last)) {
                                var pin = this.pinStack.pop() || this.getDefaultText();
                                this.setTextConfig(pin, last.getStartX(), last.getStartY(),
                                    last.getText(), last.getMatrix());
                                pin.getStyle().setFillStyle(last.getStyle().getFillStyle());
                                pin.alpha = 255;
                                pin.decre = last.decre;
                                this.pinMap[pin.serialId] = pin;
                            }
                            var mat = head.getMatrix(), y = head.getStartY() + mat.getOffsetY();
                            this.setTextConfig(tails[0], head.getStartX(), y, head.getText(), mat);
                            head.setText(this.getRandomChar());
                            mat.setScale(janvas.Utils.randSign(), janvas.Utils.randSign())
                                .setOffsetY(mat.getOffsetY() + this.offsetY);
                            for (var i = tails.length - 1; i > 0; i--) {
                                var next = tails[i], prev = tails[i - 1];
                                this.setTextConfig(next, prev.getStartX(), prev.getStartY(),
                                    Math.random() < 0.1 ? this.getRandomChar() : prev.getText(),
                                    prev.getMatrix());
                                if (i > this.colors.count) {
                                    next.getStyle().setFillStyle(prev.getStyle().getFillStyle());
                                    next.decre = prev.decre;
                                }
                            }
                            var range = this.colors.lightRange[1] - this.colors.lightRange[0],
                                rand = this.rand(range), tail = tails[this.colors.count];
                            tail.getStyle().setFillStyle(
                                this.colors.tailHsls[this.rand(this.colors.saturRange[1] -
                                    this.colors.saturRange[0])][rand]);
                            tail.decre = rand < range / 2 ? 8 : 6;
                            if (y >= this.$height + this.halfY) {
                                mat.setOffsetY(0);
                                var x = this.getRandomX();
                                head.init(x, -this.halfY, x, -this.halfY);
                            }
                        }
                    }, this);
                },
                draw: function () {
                    if (!this.$cfg) return;
                    this.background.fill();
                    this.heads.forEach(function (head) {
                        head.fill();
                        for (var i = 1; i < head.tails.length; i++) {
                            var tail = head.tails[i];
                            if (this.inBackground(tail)) {
                                tail.fill();
                            }
                        }
                    }, this);
                    for (var serialId in this.pinMap) {
                        var pin = this.pinMap[serialId];
                        if (pin.alpha > pin.decre) {
                            this.$cfg.setGlobalAlpha((pin.alpha -= pin.decre) / 255);
                            pin.fill();
                        } else {
                            delete this.pinMap[pin.serialId];
                            this.pinStack.push(pin);
                        }
                    }
                    this.$cfg.resetGlobalAlpha();
                },
                _initChars: function () {
                    // Includi i caratteri "I", "G", "O", "R", "M", "A", "N", "U", "E", "L", "G", "I", "U", "S", "E", "P", "P", "E", "R", "I", "C", "A", "R", "D", "O"
                    this.chars = ["0", "1", "I", "G", "O", "R", "M", "A", "N", "U", "E", "L", "S", "P", "C", "D"];
                },
                _initColors: function () {
                    var tailRgb = new janvas.Rgb().fromRgbString(this.colors.tail),
                        tailHsl = new janvas.Hsl().fromRgb(tailRgb), i, j, hsls;
                    this.colors.tailHsls = [];
                    for (i = this.colors.saturRange[0]; i <= this.colors.saturRange[1]; i++) {
                        this.colors.tailHsls.push(hsls = []);
                        for (j = this.colors.lightRange[0]; j <= this.colors.lightRange[1]; j++) {
                            hsls.push(tailHsl.setSaturation(i).setLightness(j).toHslString());
                        }
                    }
                    this.colors.gradient = new Array(this.colors.count);
                    var headSRgb = new janvas.Rgb().fromRgbString(this.colors.head)
                        .sRgbInverseCompanding(),
                        tailSRgb = tailRgb.sRgbInverseCompanding(),
                        mix = new janvas.Rgb();
                    for (i = 1; i < this.colors.count; i++) {
                        janvas.Rgb.sRgbGammaMixing(headSRgb, tailSRgb, i / this.colors.count, mix);
                        this.colors.gradient[i] = mix.sRgbCompanding().toRgbString();
                    }
                }
            },
            events: {
                visibilitychange: function (visible) {
                    visible ? this.$raf.resume() : this.$raf.pause();
                }
            },
            functions: {
                rand: janvas.Utils.randInt,
                getDefaultText: function () {
                    var text = new janvas.Text(this.$ctx, -this.halfY - 1, -this.halfY - 1, "");
                    text.serialId = this.serialIdIndex++;
                    text.getStyle().setFont(this.font)
                        .setTextAlign("center").setTextBaseline("middle");
                    return text;
                },
                getRandomChar: function () {
                    return this.chars[this.rand(this.chars.length)];
                },
                getRandomX: function () {
                    var x;
                    while ((x = this.rand(this.column) * this.fontSize + this.halfY)) {
                        if (this.heads.every(function (head) {
                            return x !== head.getStartX();
                        })) {
                            return x;
                        }
                    }
                },
                setTextConfig: function (tail, x, y, text, mat) {
                    tail.init(x, y, x, y).setText(text)
                        .getMatrix().setScale(mat.getScaleX(), mat.getScaleY());
                },
                inBackground: function (tail) {
                    var x = tail.getStartX(), y = tail.getStartY(), hy = this.halfY,
                        b = this.background;
                    return janvas.Collision.rect(x - hy, y - hy, x + hy, y + hy,
                        b.getStartX(), b.getStartY(), b.getWidth(), b.getHeight());
                }
            }
        });

        codeRain.init();
        codeRain.resize();

        return () => {
            codeRain.$raf.pause();
        };
    }, []);

    return <div ref={canvasRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: -1 }} />;
};

export default MatrixCodeRain;