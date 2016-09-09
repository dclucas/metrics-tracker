var configure = function () {
    if (process.env.CUCUMBER_TIMEOUT) {
        this.setDefaultTimeout(process.env.CUCUMBER_TIMEOUT);
    }
};

module.exports = configure;