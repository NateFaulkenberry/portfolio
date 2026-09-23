---
title: P(x3) Synth
description: A polyphonic JUCE synthesizer with a multi-mode source engine, a channel-style mixer, and eight reorderable FX.
image: /images/code/px3-synth.webp
github: https://github.com/NateFaulkenberry/px3-synth
tags: [App, macOS]
order: 2
---

**P(x3) Synth** is a professional-grade software synthesizer and effects platform built with C++ and JUCE, designed to bring a modern, highly flexible synthesis workflow into a familiar DAW environment. Like AV Gen, it was developed as a Claude Code–assisted project, using AI as an active engineering partner while I drove the architecture, product direction, audio design, and iterative development of the instrument.

**Key technical decisions**

* C++/JUCE architecture supporting VST3, AU, standalone, and effects workflows
* Custom synthesis engine with oscillators, envelopes, modulation, filters, and flexible signal routing
* Modular effects architecture with reusable FX components and expandable plugin infrastructure
* Cross-platform plugin UI designed around a cohesive, modern instrument experience
* Automated builds, testing, code signing, notarization, and release packaging

**Notable outcomes**

* Developed and shipped a complete commercial-quality synthesizer from the ground up
* Released multiple production versions with expanding synthesis and effects capabilities
* Built a reusable effects ecosystem that supports both instrument and standalone FX workflows
* Established an automated release pipeline including signed and notarized macOS installers
* Demonstrated that AI-assisted development can be applied effectively to a complex, production-grade audio software project
