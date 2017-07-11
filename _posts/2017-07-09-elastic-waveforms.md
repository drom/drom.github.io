---
title: Elastic Waveforms
layout: post
comments: true
categories: [WaveDrom]
---

If you are doing RTL design / verification for years (as I do) you have seeing a lot of digital timing diagrams coming from you favorite simulator ModelSim, VCS, etc.

For some reason engineers call them waveforms, even so they are pretty discrete.

You practically can't go around the office without seeing you colleagues staring at them. Everybody around have multi-monitor setups with bizarre orientations just to put lots of waveforms on it.

You can't have meaningful conversation about the RTL design, investigate the bug, or report an issue without waveforms.

Yet, we spend so much time moving, aligning, grouping, zooming to get a perfect view, and get so mad when next simulation run yields new signal names and brake you perfectly crafted view.

Typical waveform would have clock, data and control signals interleaved. It just nice having them close to each other to see cause-effect relation.

Here is how AXI write burst will look like:

<script type="WaveDrom">
{signal: [
  {name: 'ACLK',    wave: 'p............'},
  {name: 'AWADDR',  wave: 'x=.x.........', data: ['A']},
  {name: 'AWVALID', wave: '01.0.........'},
  {name: 'AWREADY', wave: 'x01x.........'},
  {name: 'WDATA',   wave: 'x..=.=.x==x..', data: ['D0','D1','D2','D3']},
  {name: 'WLAST',   wave: '0........10..'},
  {name: 'WVALID',  wave: '0..1.1.0110..'},
  {name: 'WREADY',  wave: '0...1011.10..'},
  {name: 'BRESP',   wave: 'x.........=x', data:['OK']},
  {name: 'BVALID',  wave: '0.........10'},
  {name: 'BREADY',  wave: '0..1.......0'}
]}
<script>

Typical on-chip system will have some signals are multi-bit like most of address / data buses, and some single-bit like control signals.

Some of the signals may be in X state (crosshatched area on the picture and red in your VCD viewer).

And of cause most of on-chip internal signals would be point-to-point connection between master-slave or initiator-target to be more politically correct.

Quite often each data bus will come with the pair of handshake signals.
