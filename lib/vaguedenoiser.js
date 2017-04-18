const addFilter = require('./utils').addFilter;
const registerFilter = require('./utils').registerFilter;

/**
 * Augment FfmpegCommand with the vaguedenoiser function.
 *
 *
 * @example
 *  ffmpeg().vaguedenoiser()
 *    ...             // call filter configuration functions
 *    .build()        // end filter configuration
 *    ...
 *    .applyFilters() // called once all filters have been configured
 *
 * @param  {FfmpegCommand} ffmpegCommand The fluent-ffmpeg constructor.
 * @return {FfmpegCommand} The ffmpegCommand augmented with the vaguedenoiser function.
 */
function vaguedenoiser(ffmpegCommand) {
  registerFilter(ffmpegCommand, 'vaguedenoiser', function() {
    return new VaguedenoiserFilter(this);
  });
  return ffmpegCommand;
}

/**
 * Class exposing methods to configure the vstack filter in a builder pattern way.
 *
 * See {@link http://ffmpeg.org/ffmpeg-filters.html#vstack} for a description
 * of each configuration option.
 */
class VaguedenoiserFilter {
  /**
   * @param  {FfmpegCommand} ffmpegCommand The fluent-ffmpeg constructor.
   */
  constructor (ffmpeg) {
    this.ffmpeg = ffmpeg;
    VaguedenoiserFilter.prototype.withThreshold = this.threshold;
    VaguedenoiserFilter.prototype.withMethod = this.method;
    VaguedenoiserFilter.prototype.withNsteps = this.nsteps;
    VaguedenoiserFilter.prototype.withPercent = this.percent;
    VaguedenoiserFilter.prototype.withPlanes = this.planes;
  }

  /**
   * The filtering strength. The higher, the more filtered the video will be.
   * Hard thresholding can use a higher threshold than soft thresholding
   * before the video looks overfiltered.
   * 
   * 
   * @param val
   */
  threshold(val) {
    this._threshold = val;
    return this;
  }

  /**
   * 
   * @param val
   */
  method(val) {
    this._method = val;
    return this;
  }

  /**
   * Number of times, the wavelet will decompose the picture. Picture can’t
   * be decomposed beyond a particular point (typically, 8 for a 640x480
   * frame - as 2^9 &#x3D; 512 &gt; 480)
   * 
   * 
   * @param val
   */
  nsteps(val) {
    this._nsteps = val;
    return this;
  }

  /**
   * Partial of full denoising (limited coefficients shrinking), from 0 to 100.
   * 
   * 
   * @param val
   */
  percent(val) {
    this._percent = val;
    return this;
  }

  /**
   * A list of the planes to process. By default all planes are processed.
   * 
   * @param val
   */
  planes(val) {
    this._planes = val;
    return this;
  }


  /**
   * Creates this filter configuration and registers it in the ffmpeg instance.
   * @return {ffmpegCommand} The ffmpeg instance.
   */
  build() {
    let opt = {};
    if (this._threshold) {
      opt['threshold'] = this._threshold;
    }
    if (this._method) {
      opt['method'] = this._method;
    }
    if (this._nsteps) {
      opt['nsteps'] = this._nsteps;
    }
    if (this._percent) {
      opt['percent'] = this._percent;
    }
    if (this._planes) {
      opt['planes'] = this._planes;
    }

    addFilter(this.ffmpeg, {
      filter: 'vaguedenoiser',
      options: opt
    });
    return this.ffmpeg;
  }
}

module.exports.vaguedenoiser = vaguedenoiser;
