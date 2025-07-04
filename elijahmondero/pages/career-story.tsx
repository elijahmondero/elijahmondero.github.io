import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useTheme } from '../context/ThemeContext';

const CareerStory = () => {
  const { isDarkTheme, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState('overview');

  const showSection = (sectionId: string) => {
    setActiveSection(sectionId);
  };

  return (
    <>
      <Head>
        <title>Career Story - Elijah Mondero</title>
        <meta name="description" content="Interactive career journey of Elijah Mondero - 19+ years of software development across countries and industries" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="App">
        <header className={`App-header ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
          <h1><Link href="/" className="home-link">The Tech Oracle</Link></h1>
          <label className="switch">
            <input type="checkbox" checked={isDarkTheme} onChange={toggleTheme} />
            <span className="slider"></span>
          </label>
        </header>

        <div className={`career-navigation ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
          <button 
            onClick={() => showSection('overview')} 
            className={`nav-btn ${activeSection === 'overview' ? 'active' : ''} ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}
          >
            Overview
          </button>
          <button 
            onClick={() => showSection('timeline')} 
            className={`nav-btn ${activeSection === 'timeline' ? 'active' : ''} ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}
          >
            Career Timeline
          </button>
          <button 
            onClick={() => showSection('skills')} 
            className={`nav-btn ${activeSection === 'skills' ? 'active' : ''} ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}
          >
            Skills Journey
          </button>
          <button 
            onClick={() => showSection('projects')} 
            className={`nav-btn ${activeSection === 'projects' ? 'active' : ''} ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}
          >
            Tech Hobbies
          </button>
          <button 
            onClick={() => showSection('awards')} 
            className={`nav-btn ${activeSection === 'awards' ? 'active' : ''} ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}
          >
            Awards
          </button>
        </div>

        <main>
          {/* Overview Section */}
          {activeSection === 'overview' && (
            <div className={`career-section ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
              <div className={`blog-post-content ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
                <h2>My Developer Journey: A Story of Evolution</h2>
                <p style={{ fontSize: '1.1em', marginBottom: '20px' }}>
                  My career has been a journey across countries, industries, and technologies. Looking back, a clear theme emerges: a passion for driving technological evolution. From migrating legacy systems to pioneering new frameworks, I've always been drawn to the challenge of building the future.
                </p>
                
                <div className="career-highlights">
                  <div className={`highlight-card ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
                    <h3>🌍 Geographic Journey</h3>
                    <p>Started in <strong>Philippines</strong>, expanded to <strong>USA (California)</strong>, thrived in <strong>Singapore</strong>, and now calling <strong>New Zealand</strong> home.</p>
                  </div>
                  <div className={`highlight-card ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
                    <h3>📈 Career Progression</h3>
                    <p>From <strong>Junior Engineer</strong> to <strong>Technical Lead</strong> to <strong>Senior Developer</strong> with AI expertise, spanning <strong>19+ years</strong> of experience.</p>
                  </div>
                  <div className={`highlight-card ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
                    <h3>🎯 Industry Impact</h3>
                    <p>Contributed to <strong>ERP systems</strong>, <strong>online gaming</strong>, <strong>healthcare</strong>, <strong>e-government</strong>, <strong>fintech</strong>, and <strong>AI innovation</strong>.</p>
                  </div>
                </div>

                <div className={`current-focus ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
                  <h3>Current Focus</h3>
                  <p>Today, I am a Senior Developer with my sights set on a senior Individual Contributor (IC) role, such as a Development Specialist or Principal Engineer. My journey has been defined by embracing change and driving technological evolution. From desktop to web, from monoliths to microservices, and now into the frontier of Generative AI, I am more excited than ever to continue learning, mentoring, and solving the complex challenges of tomorrow.</p>
                </div>
              </div>
            </div>
          )}

          {/* Timeline Section */}
          {activeSection === 'timeline' && (
            <div className={`career-section ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
              <div className={`blog-post-content ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
                <h2>Career Timeline</h2>
                <div className="career-timeline">
                  
                  <div className={`timeline-item ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
                    <div className="timeline-date">October 2024 - Present</div>
                    <div className="timeline-company"><a href="https://www.visa.co.nz/" target="_blank" rel="noopener noreferrer">Visa Inc.</a></div>
                    <div className="timeline-role">Senior Developer</div>
                    <div className="timeline-description">
                      Leading React migration of employee management system and driving GenAI initiatives.
                    </div>
                    <div className={`timeline-achievements ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
                      <h4>Key Achievements</h4>
                      <ul>
                        <li>Champion of Change (May 2025)</li>
                        <li>GenAI Ambassador badge (June 2025)</li>
                        <li>Led successful GenAI hackathon project - "smart search" feature</li>
                        <li>Member of AI Champions community</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`timeline-item ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
                    <div className="timeline-date">May 2022 - September 2024</div>
                    <div className="timeline-company"><a href="https://www.myob.com/" target="_blank" rel="noopener noreferrer">MYOB</a></div>
                    <div className="timeline-role">Senior Developer (Platform Engineering)</div>
                    <div className="timeline-description">
                      Transitioned into platform engineering, becoming a "go-to" developer for AWS-based systems.
                    </div>
                    <div className={`timeline-achievements ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
                      <h4>Key Achievements</h4>
                      <ul>
                        <li>Led design of secure debug provisioning system</li>
                        <li>Built new modern hosting platform for SREs</li>
                        <li>Pioneered microservices using AWS Lambda and Fargate</li>
                        <li>Developed RAG application using Azure OpenAI</li>
                        <li>Nominated twice for collaboration excellence</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`timeline-item ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
                    <div className="timeline-date">November 2014 - April 2022</div>
                    <div className="timeline-company"><a href="https://www.thinkproject.com/products/thinkproject-ramm/" target="_blank" rel="noopener noreferrer">RAMM Software</a></div>
                    <div className="timeline-role">Senior Developer / Technical Lead</div>
                    <div className="timeline-description">
                      Nearly eight years leading product teams, modernizing legacy systems, and mentoring developers. RAMM Software was acquired by Thinkproject on April 1st, 2020.
                    </div>
                    <div className={`timeline-achievements ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
                      <h4>Key Achievements</h4>
                      <ul>
                        <li>Led migration from legacy Delphi to modern SaaS platform</li>
                        <li>Established Gitflow workflow and Git migration</li>
                        <li>Pioneered first .NET Core application</li>
                        <li>Served as Scrum Master and mentor</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`timeline-item ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
                    <div className="timeline-date">May 2014 - November 2014</div>
                    <div className="timeline-company"><a href="https://www.fiserv.com/" target="_blank" rel="noopener noreferrer">Fiserv</a></div>
                    <div className="timeline-role">Senior Software Developer</div>
                    <div className="timeline-description">
                      Contributed to "Mobiliti" mobile banking platform in fast-paced FinTech environment.
                    </div>
                    <div className={`timeline-achievements ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
                      <h4>Key Achievements</h4>
                      <ul>
                        <li>Most Valuable Player for September 2014</li>
                        <li>Delivered key features for mobile banking platform</li>
                        <li>First formal experience with Agile methodology</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`timeline-item ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
                    <div className="timeline-date">May 2012 - 2014</div>
                    <div className="timeline-company"><a href="https://www.crimsonlogic.com/" target="_blank" rel="noopener noreferrer">CrimsonLogic</a></div>
                    <div className="timeline-role">Senior Software Engineer → Lead Software Engineer</div>
                    <div className="timeline-description">
                      Instrumental in building Singapore's first electronic litigation system for the Supreme Court.
                    </div>
                    <div className={`timeline-achievements ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
                      <h4>Key Achievements</h4>
                      <ul>
                        <li>Core contributor to <a href="https://www.elitigation.sg/" target="_blank" rel="noopener noreferrer" style={{ color: isDarkTheme ? '#bb86fc' : '#007bff', textDecoration: 'none' }}>eLitigation</a></li>
                        <li>Built bespoke JavaScript framework (similar to early AngularJS)</li>
                        <li>On-site deployment at Supreme Court data center</li>
                        <li>Promoted to Lead Software Engineer</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`timeline-item ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
                    <div className="timeline-date">May 2011 - May 2012</div>
                    <div className="timeline-company">Comtel Solutions / <a href="https://www.synapxe.sg/" target="_blank" rel="noopener noreferrer">IHiS</a></div>
                    <div className="timeline-role">Senior Software Consultant</div>
                    <div className="timeline-description">
                      Modernized clinical systems for Singapore's National Health Group. Worked with Integrated Health Information Systems (IHiS), now known as Synapxe Pte Ltd since 2023.
                    </div>
                    <div className={`timeline-achievements ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
                      <h4>Key Achievements</h4>
                      <ul>
                        <li>Results Module Webify project - desktop to web migration</li>
                        <li>Disaster Recovery Tool using Silverlight and WCF</li>
                        <li>Contributed to critical healthcare applications</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`timeline-item ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
                    <div className="timeline-date">August 2010 - April 2011</div>
                    <div className="timeline-company"><a href="https://www.xuenn.com/" target="_blank" rel="noopener noreferrer">Xuenn Pte Ltd</a></div>
                    <div className="timeline-role">IT Consultant</div>
                    <div className="timeline-description">
                      Fast-paced online gaming development for high-traffic betting platform.
                    </div>
                    <div className={`timeline-achievements ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
                      <h4>Key Achievements</h4>
                      <ul>
                        <li>Delivered features for <a href="https://www.188bet.com/" target="_blank" rel="noopener noreferrer" style={{ color: isDarkTheme ? '#bb86fc' : '#007bff', textDecoration: 'none' }}>188bet.com</a></li>
                        <li>Worked on "AgileBet" second-generation system</li>
                        <li>Solved critical concurrency and performance issues</li>
                        <li>Handled thousands of concurrent users</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`timeline-item ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
                    <div className="timeline-date">April 2006 - August 2010</div>
                    <div className="timeline-company"><a href="https://www.accountmate.com/" target="_blank" rel="noopener noreferrer">AccountMate Philippines</a></div>
                    <div className="timeline-role">Junior Engineer → Senior → Team Lead</div>
                    <div className="timeline-description">
                      Career foundation: pioneered .NET development and earned trips to California, USA.
                    </div>
                    <div className={`timeline-achievements ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
                      <h4>Key Achievements</h4>
                      <ul>
                        <li>Special Merit Award for Development Innovation (2007)</li>
                        <li>Led Visual FoxPro to .NET migration</li>
                        <li>Two deployments to California (2008, 2009-2010)</li>
                        <li>Promoted to Team Lead after 4 years</li>
                      </ul>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* Skills Section */}
          {activeSection === 'skills' && (
            <div className={`career-section ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
              <div className={`blog-post-content ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
                <h2>Technical Skills Journey</h2>
                <p style={{ marginBottom: '30px' }}>My technical skills have evolved alongside my career, from foundational Microsoft technologies to modern cloud and AI expertise.</p>
                
                <div className="skills-grid">
                  <div className={`skill-category ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
                    <h3>Core Languages & Frameworks</h3>
                    <div className="skill-tags">
                      <span className="skill-tag">C#</span>
                      <span className="skill-tag">.NET Framework</span>
                      <span className="skill-tag">.NET Core</span>
                      <span className="skill-tag">VB.NET</span>
                      <span className="skill-tag">TypeScript</span>
                      <span className="skill-tag">JavaScript</span>
                      <span className="skill-tag">Python</span>
                      <span className="skill-tag">Entity Framework</span>
                      <span className="skill-tag">LINQ</span>
                    </div>
                  </div>

                  <div className={`skill-category ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
                    <h3>Web Development</h3>
                    <div className="skill-tags">
                      <span className="skill-tag">React</span>
                      <span className="skill-tag">ASP.NET MVC</span>
                      <span className="skill-tag">Web API</span>
                      <span className="skill-tag">AngularJS</span>
                      <span className="skill-tag">SignalR</span>
                      <span className="skill-tag">WPF (MVVM)</span>
                      <span className="skill-tag">Knockout.js</span>
                      <span className="skill-tag">jQuery</span>
                      <span className="skill-tag">Bootstrap</span>
                    </div>
                  </div>

                  <div className={`skill-category ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
                    <h3>Cloud & DevOps</h3>
                    <div className="skill-tags">
                      <span className="skill-tag">AWS Lambda</span>
                      <span className="skill-tag">AWS Fargate</span>
                      <span className="skill-tag">AWS S3</span>
                      <span className="skill-tag">Microsoft Azure</span>
                      <span className="skill-tag">Docker</span>
                      <span className="skill-tag">Kubernetes</span>
                      <span className="skill-tag">Terraform</span>
                      <span className="skill-tag">Git (Gitflow)</span>
                      <span className="skill-tag">Azure DevOps</span>
                    </div>
                  </div>

                  <div className={`skill-category ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
                    <h3>Artificial Intelligence</h3>
                    <div className="skill-tags">
                      <span className="skill-tag">Generative AI</span>
                      <span className="skill-tag">Large Language Models</span>
                      <span className="skill-tag">Agent Engineering</span>
                      <span className="skill-tag">RAG</span>
                      <span className="skill-tag">Azure OpenAI</span>
                    </div>
                  </div>

                  <div className={`skill-category ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
                    <h3>Databases & Data</h3>
                    <div className="skill-tags">
                      <span className="skill-tag">MS SQL Server</span>
                      <span className="skill-tag">Oracle 10g</span>
                      <span className="skill-tag">ADO.NET</span>
                      <span className="skill-tag">nHibernate</span>
                      <span className="skill-tag">Crystal Reports</span>
                      <span className="skill-tag">SSRS</span>
                    </div>
                  </div>

                  <div className={`skill-category ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
                    <h3>Methodologies & Architecture</h3>
                    <div className="skill-tags">
                      <span className="skill-tag">Microservices</span>
                      <span className="skill-tag">Domain-Driven Design</span>
                      <span className="skill-tag">Test-Driven Development</span>
                      <span className="skill-tag">Scrum</span>
                      <span className="skill-tag">Design Patterns</span>
                      <span className="skill-tag">OOP</span>
                      <span className="skill-tag">N-Tier Architecture</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Projects Section */}
          {activeSection === 'projects' && (
            <div className={`career-section ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
              <div className={`blog-post-content ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
                <h2>Tech Hobbies & Side Projects</h2>
                <p style={{ marginBottom: '30px' }}>My passion for technology extends beyond professional work through personal projects, freelance work, and experimental ventures.</p>
                
                <div className="projects-grid">
                  <div className={`project-card ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
                    <h3>🤖 The New Oracle</h3>
                    <div className="project-period">Current Project</div>
                    <p>AI-generated news blog powered by multi-agent architecture. Fully automated system using GitHub Actions that analyzes news and publishes articles hourly.</p>
                    <div style={{ marginTop: '15px' }}>
                      <strong>Website:</strong> <a href="https://theneworacle.github.io/" target="_blank" rel="noopener noreferrer" style={{ color: isDarkTheme ? '#bb86fc' : '#007bff', textDecoration: 'none' }}>theneworacle.github.io</a><br/>
                      <strong>Tech Stack:</strong> AI Agents, GitHub Actions, Multi-Agent Architecture
                    </div>
                  </div>

                  <div className={`project-card ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
                    <h3>📝 The Tech Oracle Blog</h3>
                    <div className="project-period">Personal Blog</div>
                    <p>AI-assisted technology blog covering software development, cloud engineering, and AI innovations. Features insights on .NET, AWS, and Generative AI from a practitioner's perspective.</p>
                    <div style={{ marginTop: '15px' }}>
                      <strong>Website:</strong> <a href="https://elijahmondero.github.io/" target="_blank" rel="noopener noreferrer" style={{ color: isDarkTheme ? '#bb86fc' : '#007bff', textDecoration: 'none' }}>elijahmondero.github.io</a><br/>
                      <strong>Tech Stack:</strong> Next.js, React, Static Site Generation, AI-Assisted Writing
                    </div>
                  </div>

                  <div className={`project-card ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
                    <h3>💼 Clubfit Gym Management</h3>
                    <div className="project-period">Freelance Project</div>
                    <p>Cloud-hosted gym management system for Australian client. Integrated various hardware entry systems including fob and fingerprint scanners (InnerRange, Genie).</p>
                    <div style={{ marginTop: '15px' }}>
                      <strong>Website:</strong> <a href="https://www.clubfitsoftware.com.au/" target="_blank" rel="noopener noreferrer" style={{ color: isDarkTheme ? '#bb86fc' : '#007bff', textDecoration: 'none' }}>clubfitsoftware.com.au</a><br/>
                      <strong>Status:</strong> Still active, freelance contract completed
                    </div>
                  </div>

                  <div className={`project-card ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
                    <h3>🎮 Project Emerald</h3>
                    <div className="project-period">Personal Project</div>
                    <p>Top-down Pokémon-style RPG simulation using WPF and WCF duplex services. Complex real-time, multi-user server logic implementation.</p>
                    <div style={{ marginTop: '15px' }}>
                      <strong>Tech Stack:</strong> WPF, WCF, Real-time Gaming
                    </div>
                  </div>

                  <div className={`project-card ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
                    <h3>📊 Project Julie</h3>
                    <div className="project-period">Personal Project</div>
                    <p>Full n-Tier, domain-driven accounting system with MVVM frontend, WCF services, and Entity Framework POCO data layer.</p>
                    <div style={{ marginTop: '15px' }}>
                      <strong>Tech Stack:</strong> MVVM, WCF, Entity Framework
                    </div>
                  </div>

                  <div className={`project-card ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
                    <h3>🎮 Ninjuro Ragnarok Online</h3>
                    <div className="project-period">University Era</div>
                    <p>Successfully hosted private MMORPG server using rAthena emulator. Managed databases, server maintenance, and online gaming communities.</p>
                    <div style={{ marginTop: '15px' }}>
                      <strong>Learning:</strong> Server Management, Database Administration
                    </div>
                  </div>

                  <div className={`project-card ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
                    <h3>🔧 Self-Hosted DevOps</h3>
                    <div className="project-period">mondero.net era</div>
                    <p>Ran personal server hosting Git repositories (Stash), bug tracker (JIRA), and tech blog. Personal DevOps learning laboratory.</p>
                    <div style={{ marginTop: '15px' }}>
                      <strong>Tech Stack:</strong> Git, JIRA, Bamboo CI, Self-hosted Infrastructure
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Awards Section */}
          {activeSection === 'awards' && (
            <div className={`career-section ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
              <div className={`blog-post-content ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
                <div className={`awards-section ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
                  <h2>Awards & Recognition</h2>
                  <p style={{ marginBottom: '30px' }}>Recognition received throughout my career journey across different companies and countries.</p>
                  
                  <div className="awards-grid">
                    <div className={`award-card ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
                      <div className="award-year">2025</div>
                      <h3>Champion of Change</h3>
                      <p>Visa Inc. - For taking charge of Spend Clarity's first GenAI initiatives</p>
                    </div>
                    
                    <div className={`award-card ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
                      <div className="award-year">2025</div>
                      <h3>GenAI Ambassador</h3>
                      <p>Visa Inc. - For GenAI evangelism</p>
                    </div>
                    
                    <div className={`award-card ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
                      <div className="award-year">2014</div>
                      <h3>Most Valuable Player</h3>
                      <p>Fiserv Limited - September 2014</p>
                    </div>
                    
                    <div className={`award-card ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
                      <div className="award-year">2007</div>
                      <h3>Special Merit Award</h3>
                      <p>AccountMate Philippines - Development Innovation</p>
                    </div>
                    
                    <div className={`award-card ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
                      <div className="award-year">2006</div>
                      <h3>Third Honors (Cum Laude)</h3>
                      <p>University of Cebu - Computer Science Degree</p>
                    </div>
                    
                    <div className={`award-card ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
                      <div className="award-year">1998-2002</div>
                      <h3>Best in Computer (4x)</h3>
                      <p>San Isidro Parish School - Four consecutive years</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <style jsx>{`
        .career-navigation {
          display: flex;
          margin: 20px;
          background: transparent;
          border-bottom: 1px solid #e0e0e0;
          overflow-x: auto;
          flex-wrap: wrap;
          gap: 5px;
        }

        .career-navigation.dark-theme {
          border-bottom-color: #333;
        }

        .nav-btn {
          background: none;
          border: 1px solid #e0e0e0;
          padding: 10px 15px;
          cursor: pointer;
          font-weight: 500;
          color: #6c757d;
          transition: all 0.3s ease;
          white-space: nowrap;
          border-radius: 5px;
          margin-bottom: 10px;
          font-family: 'Open Sans', sans-serif;
        }

        .nav-btn:hover {
          background: #f8f9fa;
          color: #495057;
        }

        .nav-btn.active {
          background: #007bff;
          color: white;
          border-color: #007bff;
        }

        .nav-btn.dark-theme {
          color: #e0e0e0;
          border-color: #333;
        }

        .nav-btn.dark-theme:hover {
          background: #333;
          color: #e0e0e0;
        }

        .nav-btn.dark-theme.active {
          background: #bb86fc;
          border-color: #bb86fc;
        }

        .career-section {
          animation: fadeIn 0.5s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .career-highlights {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin: 30px 0;
        }

        .highlight-card {
          padding: 20px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }

        .highlight-card:hover {
          transform: translateY(-5px);
        }

        .highlight-card.dark-theme {
          border-color: #333;
          background: #1f1f1f;
        }

        .highlight-card h3 {
          color: #007bff;
          margin-bottom: 10px;
          font-size: 1.1em;
          font-family: 'Merriweather', serif;
        }

        .highlight-card.dark-theme h3 {
          color: #bb86fc;
        }

        .current-focus {
          margin-top: 30px;
          padding: 20px;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border-radius: 8px;
          text-align: center;
        }

        .current-focus.dark-theme {
          background: linear-gradient(135deg, #1f1f1f 0%, #333 100%);
        }

        .current-focus h3 {
          color: #007bff;
          margin-bottom: 15px;
          font-family: 'Merriweather', serif;
        }

        .current-focus.dark-theme h3 {
          color: #bb86fc;
        }

        .career-timeline {
          position: relative;
          padding-left: 30px;
        }

        .career-timeline::before {
          content: '';
          position: absolute;
          left: 15px;
          top: 0;
          bottom: 0;
          width: 3px;
          background: linear-gradient(to bottom, #007bff, #6c757d);
        }

        .timeline-item {
          position: relative;
          margin-bottom: 30px;
          padding: 20px;
          margin-left: 20px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .timeline-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        .timeline-item.dark-theme {
          border-color: #333;
          background: #1f1f1f;
        }

        .timeline-item::before {
          content: '';
          position: absolute;
          left: -35px;
          top: 25px;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background: #007bff;
          border: 3px solid white;
          box-shadow: 0 0 0 3px #007bff;
        }

        .timeline-item.dark-theme::before {
          background: #bb86fc;
          border-color: #1f1f1f;
          box-shadow: 0 0 0 3px #bb86fc;
        }

        .timeline-date {
          font-weight: bold;
          color: #007bff;
          font-size: 1.1em;
          margin-bottom: 10px;
        }

        .timeline-item.dark-theme .timeline-date {
          color: #bb86fc;
        }

        .timeline-company {
          font-size: 1.3em;
          font-weight: bold;
          color: #2c3e50;
          margin-bottom: 5px;
          font-family: 'Merriweather', serif;
        }

        .timeline-company a {
          color: inherit;
          text-decoration: none;
        }

        .timeline-company a:hover {
          text-decoration: underline;
        }

        .timeline-item.dark-theme .timeline-company {
          color: #e0e0e0;
        }

        .timeline-item.dark-theme .timeline-company a {
          color: #e0e0e0;
        }

        .timeline-role {
          color: #7f8c8d;
          font-style: italic;
          margin-bottom: 15px;
        }

        .timeline-item.dark-theme .timeline-role {
          color: #aaa;
        }

        .timeline-description {
          margin-bottom: 15px;
        }

        .timeline-achievements {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          border-left: 4px solid #007bff;
        }

        .timeline-achievements.dark-theme {
          background: #333;
          border-left-color: #bb86fc;
        }

        .timeline-achievements h4 {
          color: #007bff;
          margin-bottom: 10px;
          font-family: 'Merriweather', serif;
        }

        .timeline-achievements.dark-theme h4 {
          color: #bb86fc;
        }

        .timeline-achievements ul {
          list-style: none;
          padding-left: 0;
        }

        .timeline-achievements li {
          padding: 5px 0;
          padding-left: 20px;
          position: relative;
        }

        .timeline-achievements li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #28a745;
          font-weight: bold;
        }

        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }

        .skill-category {
          padding: 20px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }

        .skill-category:hover {
          transform: translateY(-5px);
        }

        .skill-category.dark-theme {
          border-color: #333;
          background: #1f1f1f;
        }

        .skill-category h3 {
          color: #007bff;
          margin-bottom: 15px;
          font-size: 1.1em;
          font-family: 'Merriweather', serif;
        }

        .skill-category.dark-theme h3 {
          color: #bb86fc;
        }

        .skill-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .skill-tag {
          background: #007bff;
          color: white;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 0.9em;
          transition: background 0.3s ease;
        }

        .skill-tag:hover {
          background: #0056b3;
        }

        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }

        .project-card {
          padding: 20px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }

        .project-card:hover {
          transform: translateY(-5px);
        }

        .project-card.dark-theme {
          border-color: #333;
          background: #1f1f1f;
        }

        .project-card h3 {
          color: #007bff;
          margin-bottom: 10px;
          font-family: 'Merriweather', serif;
        }

        .project-card.dark-theme h3 {
          color: #bb86fc;
        }

        .project-period {
          color: #7f8c8d;
          font-style: italic;
          margin-bottom: 15px;
        }

        .project-card.dark-theme .project-period {
          color: #aaa;
        }

        .awards-section {
          text-align: center;
        }

        .awards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }

        .award-card {
          padding: 20px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }

        .award-card:hover {
          transform: translateY(-5px);
        }

        .award-card.dark-theme {
          border-color: #333;
          background: #1f1f1f;
        }

        .award-year {
          font-size: 1.2em;
          font-weight: bold;
          margin-bottom: 10px;
          color: #007bff;
          font-family: 'Merriweather', serif;
        }

        .award-card.dark-theme .award-year {
          color: #bb86fc;
        }

        .award-card h3 {
          font-family: 'Merriweather', serif;
        }

        @media (max-width: 768px) {
          .career-navigation {
            margin: 10px;
          }
          
          .nav-btn {
            padding: 8px 12px;
            font-size: 0.9em;
          }
          
          .career-highlights {
            grid-template-columns: 1fr;
          }
          
          .timeline-item {
            margin-left: 10px;
            padding: 15px;
          }
          
          .skills-grid,
          .projects-grid {
            grid-template-columns: 1fr;
          }
          
          .projects-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
};

export default CareerStory;
