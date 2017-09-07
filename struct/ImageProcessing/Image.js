const gm = require("gm").subClass({ imageMagick: true });
const fs = require("fs");
const request = require("request");

const path = "./struct/ImageProcessing/images/";

/**
 * Image Manipulation
 * @class Image
 */
class Image {
    constructor(...options) {
        this.image = gm(...options);
    }

    get gm() { return this.image; }

    /**
     * Conver to buffer and send
     * 
     * @param {Function} send 
     * @param {String} [format="PNG"]
     * @memberof Image
     */
    async send(send, text = "", format = "PNG") {
        try {
            var buffer = await this._toBuffer(format);
            await send(text, { files: [buffer] });
        } catch (e) {
            console.log(e);
            return e;
        }
    }


    /** @private */
    _toBuffer(format = "PNG") {
        return new Promise((resolve, reject) => {
            this.image.stream(format, (err, stdout, stderr) => {
                if (err) { return reject(err) }
                const chunks = []
                stdout.on("data", (chunk) => { chunks.push(chunk) })
                stdout.once("end", () => { resolve(Buffer.concat(chunks)) })
                stderr.once("data", (data) => { reject(String(data)) })
            })
        })
    }

    /**
     * Read an image from iamges
     * 
     * @static
     * @param {String} filename 
     * @returns {Buffer}
     * @memberof Image
     */
    static readFile(filename) {
        return new Promise((resolve, reject) => {
            fs.readFile(path + filename, (err, buffer) => {
                if (err) return reject(err);
                resolve(buffer);
            });
        });
    }

    /**
     * 
     */
    static readUrl(url) {
        return request(url);
    }

}

module.exports = Image;