import type { DspSettings } from '../types/piano';

export class EffectsChain {
  private ctx: AudioContext;
  
  public inputNode: GainNode;
  public outputNode: GainNode;

  private eqLow: BiquadFilterNode;
  private eqMid: BiquadFilterNode;
  private eqHigh: BiquadFilterNode;

  private compressor: DynamicsCompressorNode;

  private reverbNode: ConvolverNode;
  private reverbGain: GainNode;

  private delayNode: DelayNode;
  private delayFeedbackGain: GainNode;
  private delayMixGain: GainNode;

  private chorusFilter: BiquadFilterNode;
  private chorusLfo: OscillatorNode;
  private chorusLfoGain: GainNode;
  private chorusMixGain: GainNode;

  constructor(ctx: AudioContext) {
    this.ctx = ctx;

    this.inputNode = ctx.createGain();
    this.outputNode = ctx.createGain();

    this.eqLow = ctx.createBiquadFilter();
    this.eqLow.type = 'lowshelf';
    this.eqLow.frequency.setValueAtTime(100, ctx.currentTime);

    this.eqMid = ctx.createBiquadFilter();
    this.eqMid.type = 'peaking';
    this.eqMid.frequency.setValueAtTime(1000, ctx.currentTime);
    this.eqMid.Q.setValueAtTime(1, ctx.currentTime);

    this.eqHigh = ctx.createBiquadFilter();
    this.eqHigh.type = 'highshelf';
    this.eqHigh.frequency.setValueAtTime(8000, ctx.currentTime);

    this.compressor = ctx.createDynamicsCompressor();
    this.compressor.threshold.setValueAtTime(-24, ctx.currentTime);
    this.compressor.ratio.setValueAtTime(4, ctx.currentTime);

    this.reverbNode = ctx.createConvolver();
    this.reverbNode.buffer = this.createImpulseResponse(2.5, 2.0);
    this.reverbGain = ctx.createGain();
    this.reverbGain.gain.setValueAtTime(0.3, ctx.currentTime);

    this.delayNode = ctx.createDelay();
    this.delayNode.delayTime.setValueAtTime(0.3, ctx.currentTime);

    this.delayFeedbackGain = ctx.createGain();
    this.delayFeedbackGain.gain.setValueAtTime(0.4, ctx.currentTime);

    this.delayMixGain = ctx.createGain();
    this.delayMixGain.gain.setValueAtTime(0.2, ctx.currentTime);

    this.chorusFilter = ctx.createBiquadFilter();
    this.chorusFilter.type = 'allpass';
    this.chorusFilter.frequency.setValueAtTime(1000, ctx.currentTime);

    this.chorusLfo = ctx.createOscillator();
    this.chorusLfo.type = 'sine';
    this.chorusLfo.frequency.setValueAtTime(1.5, ctx.currentTime);

    this.chorusLfoGain = ctx.createGain();
    this.chorusLfoGain.gain.setValueAtTime(200, ctx.currentTime);

    this.chorusMixGain = ctx.createGain();
    this.chorusMixGain.gain.setValueAtTime(0.2, ctx.currentTime);

    this.chorusLfo.connect(this.chorusLfoGain);
    this.chorusLfoGain.connect(this.chorusFilter.frequency);
    this.chorusLfo.start();

    this.delayNode.connect(this.delayFeedbackGain);
    this.delayFeedbackGain.connect(this.delayNode);

    this.inputNode.connect(this.eqLow);
    this.eqLow.connect(this.eqMid);
    this.eqMid.connect(this.eqHigh);
    this.eqHigh.connect(this.compressor);
    this.compressor.connect(this.outputNode);

    this.compressor.connect(this.reverbNode);
    this.reverbNode.connect(this.reverbGain);
    this.reverbGain.connect(this.outputNode);

    this.compressor.connect(this.delayNode);
    this.delayNode.connect(this.delayMixGain);
    this.delayMixGain.connect(this.outputNode);

    this.compressor.connect(this.chorusFilter);
    this.chorusFilter.connect(this.chorusMixGain);
    this.chorusMixGain.connect(this.outputNode);
  }

  private createImpulseResponse(duration: number, decay: number): AudioBuffer {
    const sampleRate = this.ctx.sampleRate;
    const length = sampleRate * duration;
    const impulse = this.ctx.createBuffer(2, length, sampleRate);
    const left = impulse.getChannelData(0);
    const right = impulse.getChannelData(1);

    for (let i = 0; i < length; i++) {
      left[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
      right[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
    }
    return impulse;
  }

  public updateSettings(settings: DspSettings) {
    const now = this.ctx.currentTime;

    this.reverbGain.gain.setTargetAtTime(settings.reverbMix, now, 0.01);
    
    this.delayMixGain.gain.setTargetAtTime(settings.delayMix, now, 0.01);
    this.delayNode.delayTime.setTargetAtTime(settings.delayTime, now, 0.01);
    this.delayFeedbackGain.gain.setTargetAtTime(settings.delayFeedback, now, 0.01);

    this.chorusMixGain.gain.setTargetAtTime(settings.chorusMix, now, 0.01);

    this.eqLow.gain.setTargetAtTime(settings.eqLow, now, 0.01);
    this.eqMid.gain.setTargetAtTime(settings.eqMid, now, 0.01);
    this.eqHigh.gain.setTargetAtTime(settings.eqHigh, now, 0.01);

    this.compressor.threshold.setTargetAtTime(settings.compThreshold, now, 0.01);
    this.compressor.ratio.setTargetAtTime(settings.compRatio, now, 0.01);
  }
}
