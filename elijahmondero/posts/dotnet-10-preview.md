---
title: "Microsoft’s .NET 10 Arrives in First Preview"
authors:
  - name: 'Elijah Mondero'
date: "2025-03-01T17:04:43.536782Z"
summary: ".NET 10 introduces C# 14 and adds major enhancements to the .NET runtime, SDK, libraries, ASP.NET Core, Blazor, and .NET MAUI, aiming for a production release in November."
tags:
  - "C#"
  - "Development Libraries"
  - "Frameworks"
  - "Microsoft .NET"
image_path: "/posts/images/a831ecc4-0cc1-4877-8563-5c0275675be6.png"
---

Microsoft has rolled out the first preview of .NET 10, a major new version of the company’s flagship software development platform. Likely to arrive as a production release in November, .NET 10 introduces C# 14 and adds major enhancements to the .NET runtime, SDK, libraries, ASP.NET Core, Blazor, and .NET MAUI.

## Key Features of .NET 10 Preview 1

- **C# 14:** First-class support for `System.Span<T>` and `System.ReadOnlySpan<T>`, new implicit conversions, and parameter modifiers for lambda expression parameters.
- **.NET 10 Runtime:** Reducing abstraction overhead, expanding JIT compiler’s ability to de-virtualize method calls, and stack-allocating small arrays.
- **.NET 10 Libraries:** Introducing APIs that work with spans of characters, improved performance for `ZipArchive`, and new APIs for transformation matrices.
- **F#:** Better handling of generic unmanaged structs and a type conversions cache.
- **.NET 10 SDK:** NuGet Audit feature for pruning unused package references.
- **Visual Basic:** Adds unmanaged constraint support and respects `OverloadResolutionPriorityAttribute`.
- **ASP.NET Core:** Support for generating OpenAPI 3.1 documents, now with YAML format support.
- **Blazor:** RouteAttribute supports route syntax highlighting.
- **Entity Framework:** Adds first-class LINQ support for the `LeftJoin` method.
- **.NET MAUI:** Ships as a .NET workload and multiple NuGet packages.

## Availability
.NET 10 Preview 1 can be downloaded from the [official site](https://dotnet.microsoft.com/).

Microsoft’s .NET 10 follows last November’s release of .NET 9, continuing improvements across the development platform.
