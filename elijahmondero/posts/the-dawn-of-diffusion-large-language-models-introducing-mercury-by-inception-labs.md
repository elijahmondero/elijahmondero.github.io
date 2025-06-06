---
title: "The Dawn of Diffusion Large Language Models: Introducing Mercury by Inception Labs"
authors:
  - name: 'Elijah Mondero'
date: "2025-04-06T17:44:59.455536Z"
summary: "Inception Labs has introduced a groundbreaking approach to AI with Diffusion Large Language Models (dLLMs). Their first commercial product, Mercury, promises faster and more efficient text generation, marking a significant advancement in the field."
tags:
  - "AI"
  - "Machine Learning"
  - "Diffusion Models"
  - "Language Models"
  - "Inception Labs"
  - "Mercury"
image_path: "/posts/images/74635d2e-cf19-486f-be20-1c3f5ddc9eee.png"
---

For years, large language models (LLMs) have operated within a well-defined paradigm: autoregression. Each word or token is generated sequentially, creating a fundamental bottleneck in speed and efficiency. This has led to increasing inference costs and latency issues as AI-generated text becomes more complex. Now, Inception Labs, a startup co-founded by Stanford professor Stefano Ermon and his colleagues Volodymyr Kuleshov and Aditya Grover, is introducing a different approach with Diffusion Large Language Models (dLLMs). Their first commercial-scale product, Mercury, aims to disrupt the status quo by offering significantly faster and more efficient text generation.

## The Diffusion Model Shift

Traditional LLMs, including OpenAI’s GPT-4o and Anthropic’s Claude 3.5 Haiku, generate text in a left-to-right fashion, with each token dependent on those before it. While this sequential process allows for contextual depth, it also means that longer responses come with exponentially increasing computational costs. Companies optimizing these models have focused on test-time computation to improve reasoning, but this approach has created trade-offs in speed and usability.

Diffusion models, by contrast, operate differently. Rather than generating one token at a time, they use a “coarse-to-fine” approach, refining an initial rough estimate in parallel over a series of denoising steps. This method is widely used in AI-generated images, video, and audio—powering tools like OpenAI’s Sora, Midjourney, and Riffusion—but its application to text has been largely unsuccessful. Until now.

> “Diffusion models start with a rough estimate of data and refine it all at once,” Ermon told TechCrunch. “With LLMs, you cannot generate the second word until you’ve generated the first one, and you cannot generate the third one until you generate the first two.” By leveraging diffusion’s unique structure, Mercury’s dLLMs aim to bypass these constraints and deliver responses more efficiently than their autoregressive counterparts.

## Mercury: High-Speed Language Generation

Mercury claims to be up to 10 times faster than the most speed-optimized LLMs. While traditional models max out at around 200 tokens per second, Mercury achieves over 1,000 tokens per second on commodity NVIDIA H100 GPUs—a speed previously only possible with custom hardware like Groq, Cerebras, or SambaNova. Compared to some frontier models running at less than 50 tokens per second, Mercury offers a 20x speedup.

The first Mercury release, Mercury Coder, is optimized for code generation and outperforms existing speed-optimized models such as GPT-4o Mini and Claude 3.5 Haiku on standard coding benchmarks. Despite its faster inference speed, Mercury Coder maintains a competitive level of quality, proving that diffusion-based models can hold their own against top-tier autoregressive LLMs.

A company spokesperson emphasized the impact of these improvements:

> “Our ‘small’ coding model is as good as [OpenAI’s] GPT-4o Mini while more than 10 times as fast. Our ‘mini’ model outperforms small open-source models like [Meta’s] Llama 3.1 8B and achieves more than 1,000 tokens per second.”

## Addressing the Cost of AI

One of the biggest challenges in AI deployment today is the rising cost of inference. LLMs require substantial computational power, and the increasing complexity of reasoning traces has made cost reduction difficult. Mercury’s diffusion-based approach has the potential to make high-quality AI more accessible by dramatically lowering the price of inference.

“Our models leverage GPUs much more efficiently,” Ermon noted. “I think this is a big deal. This is going to change the way people build language models.”

Unlike other speed-focused AI solutions that rely on specialized chips, Mercury’s speed improvements come from algorithmic advancements rather than hardware dependence. This means that as GPU technology continues to advance, Mercury’s performance gains could further compound.

## Enterprise Access and Adoption

Mercury is available to enterprise customers through both an API and on-premise deployments, allowing businesses to integrate high-speed language generation into their operations seamlessly.
