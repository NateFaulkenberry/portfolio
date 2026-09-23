---
# ── Code project fields ───────────────────────────────────────────────
# title:        (required) Project name
# description:  (required) One-sentence summary shown in cards
# image:        Path under public/, e.g. /images/code/my-project.jpg
#               A placeholder is shown until the file exists.
# github:       Repository URL
# url:          Live site / demo URL
# links:        Extra links, as a list of { label, url }
# tags:         List of technologies
# year:         Year or date range, e.g. 2026 or "2024–2026"
# featured:     true to show on the home page
# order:        Optional number to force ordering (lower first)
# The Markdown body below the frontmatter is the longer write-up.
# ──────────────────────────────────────────────────────────────────────
title: AV Gen
description: A native C++ real-time GPU audiovisual engine
image: /images/code/av-gen.webp
github: https://github.com/NateFaulkenberry/av-gen
tags: [App, macOS]
featured: true
order: 1
# links:
#   - label: Documentation
#     url: https://example.com/docs
---

**AV Gen** is a C++ audiovisual 3D world engine designed to turn music into dynamic, cinematic environments and performances. I used Claude Code as an autonomous coding partner to build a large, unfamiliar C++ codebase—deliberately pushing beyond the languages and frameworks I would normally work in and using AI to accelerate both implementation and exploration.

**Key technical decisions**

* C++23 on Apple Silicon with WebGPU/Dawn and Metal for GPU rendering
* Audio → analysis → signal bus → modulation → scene → renderer architecture
* Procedural and authored 3D worlds with glTF asset pipelines
* Real-time lighting, shadows, post-processing, GPU culling, and HDR rendering
* Automated regression testing and performance profiling built into the development process

**Notable outcomes**

* Built a substantial production-style C++ codebase from the ground up with extensive automated testing
* Developed multiple fully realized audiovisual worlds, including the Glowmere bioluminescent environment
* Achieved real-time cinematic rendering with complex scenes containing thousands of visible objects and millions of triangles
* Explored AI-assisted software development as a practical way to tackle a domain and codebase well outside my normal development stack
