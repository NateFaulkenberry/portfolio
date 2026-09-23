---
title: Music Trainer
description: Static browser-based music training app
image: /images/code/music-trainer.webp
github: https://github.com/NateFaulkenberry/music-trainer
tags: [App, Web]
order: 3
links:
  - label: View Online
    url: https://natefaulkenberry.github.io/music-trainer/
---

**Music Trainer** is a browser-based music education application designed to make ear training and music theory practice interactive, immediate, and repeatable. I built it around a reusable audio and piano engine, using data-driven training challenges to support multiple modes of practice without requiring a backend or complicated infrastructure.

**Key technical decisions**

* Client-side architecture designed to run entirely as a static web application
* Reusable Web Audio and virtual piano engine for generating and playing musical material
* Data-driven challenge system allowing new training modes to be added without duplicating core logic
* Independent scoring, answer validation, feedback, and challenge-generation systems
* Keyboard and MIDI input alongside an interactive on-screen piano for flexible practice

**Notable outcomes**

* Built multiple ear-training modes covering intervals, triads, and seventh chords
* Supported harmonic, ascending, descending, and randomized interval exercises
* Added chord-quality and inversion training across major, minor, diminished, augmented, and extended seventh-chord types
* Created an interactive feedback loop with replay, answer submission, scoring, and note/chord reveal
* Evolved an initial modal-training experiment into a reusable foundation for a broader music-training platform