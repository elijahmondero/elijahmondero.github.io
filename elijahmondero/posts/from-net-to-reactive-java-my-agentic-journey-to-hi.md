---
title: "From .NET to Reactive Java: My Agentic Journey to High-Quality Software"
authors:
  - name: 'Elijah Mondero'
date: "2026-05-16T08:04:54Z"
summary: "Discover how a seasoned .NET developer leveraged agentic coding, specifically with an AI co-pilot, to successfully build a complex Java/React application using Spring Boot, WebFlux, OpenTelemetry, and more. This journey redefines the SDLC, showcasing how AI partnership accelerates learning and delivers high-quality software."
tags:
  - "Agentic Coding"
  - "AI Co-pilot"
  - "SDLC"
  - "Software Quality"
  - "Java"
  - "React"
  - "Spring Boot"
  - "WebFlux"
  - "Reactive Programming"
  - "R2DBC"
  - "MySQL"
  - "OpenTelemetry"
  - "Distributed Tracing"
  - "SSE"
  - "WebSockets"
  - ".NET Developer"
  - "Testcontainers"
  - "Modern Development"
sources:
  - "https://cacm.acm.org/news/good-vibes-ai-coding-tools-and-platforms/"
  - "https://www.marketwatch.com/press-release/softserve-launches-agentic-engineering-suite-for-reimagined-software-development-5c5a19a9"
  - "https://www.itnews.com.au/news/lendi-group-runs-first-project-through-agentic-sdlc-625762"
  - "https://www.forbes.com/councils/forbestechcouncil/2026/04/07/rearchitecting-the-sdlc-why-agentic-ai-redefines-engineering-execution-in-2026/"
  - "https://finance.yahoo.com/sectors/technology/articles/kdg-redefines-enterprise-software-development-182500371.html"
  - "https://www.analyticsinsight.net/books/top-web-development-books-every-developer-should-read-in-2026"
  - "https://www.computerweekly.com/blog/CW-Developer-Network/CWDN-series-what-defines-modern-software-development-practices"
  - "https://www.infoq.com/news/2026/02/opentelemetry-observability/"
  - "https://www.infoq.com/news/2023/07/enhanced-testcontainers-support/"
  - "https://thenationonlineng.net/websockets-will-serve-as-real-time-communication-in-web-apps-bayo-faboro/"
  - "https://www.infoq.com/news/2024/09/canva-real-time-collaboration/"
  - "https://www.infoworld.com/article/2255670/mastering-spring-framework-5-part-2-spring-webflux.html"
  - "https://www.infoq.com/articles/Servlet-and-Reactive-Stacks-Spring-Framework-5/"
  - "https://adtmag.com/articles/2021/01/07/mariadb-r2dbc-connector-goes-ga.aspx"
  - "https://www.businesswire.com/news/home/20210107005475/en/MariaDB-Releases-New-R2DBC-Connector"
  - "https://www.dbta.com/Editorial/News-Flashes/MariaDB-Offers-New-Programming-Connector-144654.aspx"
  - "https://tech.yahoo.com/general/articles/journey-google-proton-why-switched-120010473.html"
  - "https://finance.yahoo.com/sectors/technology/articles/could-changing-guard-apple-big-120000099.html"
  - "https://tech.yahoo.com/ai/gemini/articles/tried-gmails-gemini-ai-features-152630799.html"
  - "https://tech.yahoo.com/home/articles/hidden-costs-closed-smart-home-150020223.html"
  - "https://www.yahoo.com/tech/backblaze-review-223004699.html"
image_path: "/posts/images/eff471aa-4da5-46fe-8986-4ef3c2caade3.png"
---

For years, my development world as a .NET developer revolved around Microsoft's familiar syntax and robust ecosystem. However, the rapidly evolving software landscape continually beckons with new paradigms and technologies. Recently, I embarked on an ambitious journey: to build my inaugural application in Java and React, harnessing the full power of Spring Boot, OpenTelemetry, WebFlux, R2DBC, MySQL, Server-Sent Events (SSE), and WebSockets.

This wasn't merely a language switch; it was a profound immersion into reactive programming, distributed tracing, and real-time communication. What made this daunting leap not only manageable but profoundly insightful was the invaluable assistance of "agentic coding" – specifically, my AI co-pilot, Claude.

This experience profoundly reshaped my understanding of the Software Development Life Cycle (SDLC). We're moving beyond mere code completion; we're entering an era where AI agents become integral partners throughout the entire development process, fundamentally redefining the "new SSDLC" for achieving truly high-quality software.

### The Agentic Leap: My Co-Pilot for a New Ecosystem

"Agentic coding" transcends the role of a simple intelligent assistant; it represents an AI agent capable of reasoning, planning, and executing complex tasks, thereby empowering developers to navigate intricate domains. For me, stepping into the Java/React world felt akin to simultaneously learning a new language and culture. While many concepts have counterparts in the .NET ecosystem, the implementation details, libraries, and community idioms are distinctly different. This is precisely where my agent truly excelled.

Claude rapidly became my indispensable research assistant and conceptual bridge. Whenever I grappled with the intricacies of Spring Boot's configuration, the nuances of WebFlux's reactive streams, or the setup for OpenTelemetry's distributed tracing, I turned to the agent. It didn't merely furnish answers; it helped me grasp *why* certain patterns were preferred, drew insightful parallels to my existing .NET knowledge, and even suggested optimal best practices for integrating these nascent technologies. This wasn't about the AI generating all the code, but rather about it profoundly augmenting my learning, accelerating my research, and empowering me to make well-informed architectural decisions within an entirely new stack.

### Embracing the Reactive Revolution: Spring Boot, WebFlux, and R2DBC

My new application demanded high responsiveness and scalability, naturally leading me towards reactive programming. While Spring Boot provided a robust foundation, the true paradigm shift arrived with Spring WebFlux. This framework seamlessly ushered me into the world of non-blocking, event-driven architectures, marking a significant departure from traditional imperative programming. The advantages are compelling: superior resource utilization and enhanced resilience, especially under heavy load.

To complement this, I integrated R2DBC (Reactive Relational Database Connectivity) with MySQL. R2DBC offers a non-blocking API for interacting with relational databases, perfectly aligning with WebFlux's reactive principles. This powerful combination ensured that my entire data access layer remained asynchronous, effectively preventing bottlenecks and preserving the reactive flow throughout the application. OpenTelemetry, meanwhile, proved indispensable for gaining visibility into this reactive maze. It enabled me to instrument the application for distributed tracing, metrics, and logs, providing the deep observability necessary to comprehend how requests traversed the system and to precisely pinpoint performance issues, even across disparate services.

Navigating these interconnected and often intricate reactive paradigms would undoubtedly have been a far steeper curve without the constant support of my agent. It served as an invaluable reference, explaining cryptic error messages, suggesting optimal data flow patterns, and elucidating the subtle distinctions between `Mono` and `Flux`.

### Real-Time Engagement: SSE and WebSockets

Modern web applications increasingly demand real-time interaction. For my project, I strategically employed both Server-Sent Events (SSE) and WebSockets to address distinct real-time communication requirements.

SSE, a notably simpler protocol, proved ideal for one-way, server-to-client communication. It excels in scenarios like live score updates, stock tickers, or notification feeds, where the client primarily subscribes to and receives continuous updates from the server. Its efficiency and lower resource footprint make it a strong choice for these specific use cases.

WebSockets, conversely, enabled robust full-duplex, bidirectional communication. This capability was perfectly suited for highly interactive elements such as chat functionalities or collaborative tools, where both the client and server need to send and receive messages asynchronously and frequently. Discerning when to apply each technology for optimal performance and resource utilization was yet another complex area where my agent provided invaluable clarity, offering detailed insights into their respective strengths and limitations.

### Fortifying Quality with Testcontainers and the New SDLC

Crucially, the pursuit of "good quality software" extends far beyond elegant code; it fundamentally hinges on robust testing. This is precisely where Testcontainers emerged as an indispensable tool. Testcontainers provisions lightweight, throwaway instances of databases, message brokers, web browsers, or virtually any service that can run within a Docker container, specifically for testing purposes. This capability allowed me to execute my integration tests against a *real* MySQL instance, fully isolated and consistent, eliminating the overhead of managing local installations or shared test environments.

Integrating Testcontainers into my Spring Boot application, particularly with an R2DBC setup, demanded a thorough understanding of its lifecycle and proper integration into the build process. My agent proved instrumental, helping me locate relevant examples, comprehend configuration options, and troubleshoot initial setups, thereby ensuring my tests were both comprehensive and highly reliable. This proactive approach to testing, integrated early and effectively, is a cornerstone of the "new SSDLC," where quality is meticulously baked in from the very outset, rather than being an afterthought.

### The Future is Agentic: A New Paradigm for Software Excellence

My recent journey, transitioning from a seasoned .NET developer to building a sophisticated Java/React application incorporating a suite of cutting-edge technologies—all while profoundly guided by an AI agent—has been nothing short of transformative. Agentic coding is unequivocally not a passing fad; it represents a fundamental paradigm shift in how we approach software development. It empowers developers to assimilate new technologies more rapidly, explore complex architectural landscapes with significantly greater confidence, and ultimately, engineer higher-quality software more efficiently and effectively.

For me, this complex transition felt less like a daunting struggle and more like an exhilarating, accelerated learning expedition, thanks entirely to my agentic co-pilot. It is undeniably an exciting era to be a developer, where our inherent intelligence is powerfully augmented, our technical reach is vastly extended, and the pathway to crafting truly exceptional software is clearer and more accessible than ever before. The future of the SDLC is inherently collaborative, intelligently driven, and, without a doubt, profoundly agentic.
