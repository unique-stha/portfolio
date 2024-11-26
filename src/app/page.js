'use client'

import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Sun, Moon, Menu, X, ArrowRight, SquareArrowOutUpRight } from 'lucide-react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Typewriter from "typewriter-effect"
import emailjs from "emailjs-com"
import Link from 'next/link'
import ProjectDescription from '../components/ProjectDescription'
import { projectsData } from '../data/project-data'
import AnimateOnScroll from '../components/AnimateOnScroll'
import '../styles/HomePage.css'
import '../styles/navbar.css'



// Dynamic import of Spline component with SSR disabled
const Spline = dynamic(() => import('@splinetool/react-spline').then(mod => mod.default), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center min-h-[500px]">Loading 3D Scene...</div>
})

const HomePage = () => {
  const [theme, setTheme] = useState('dark')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const projectsSectionRef = useRef(null)
  const [isReturningFromProject, setIsReturningFromProject] = useState(false)
  
  const getProjectDescription = (id) => {
    const project = projectsData.find(p => p.id === id)
    return project && project.overview && project.overview[0] ? project.overview[0].description : "Description not available"
  }

  useEffect(() => {
    setMounted(true)
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [theme])

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]')
    const navItems = document.querySelectorAll('.route, .navitem')

    const updateActiveSection = () => {
      const scrollY = window.scrollY

      sections.forEach(section => {
        const sectionHeight = section.offsetHeight
        const sectionTop = section.offsetTop
        const sectionId = section.getAttribute('id')

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navItems.forEach(item => {
            item.classList.remove('active')
            if (item.getAttribute('href') === `#${sectionId}`) {
              item.classList.add('active')
            }
          })
        }
      })
    }

    window.addEventListener('scroll', updateActiveSection)
    return () => window.removeEventListener('scroll', updateActiveSection)
  }, [])

  useEffect(() => {
    if (isReturningFromProject && projectsSectionRef.current) {
      projectsSectionRef.current.scrollIntoView({ behavior: 'smooth' })
      setIsReturningFromProject(false)
    }
  }, [isReturningFromProject])

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light')
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev)
  }

  const sendEmail = (event) => {
    event.preventDefault()

    emailjs
      .sendForm(
        "service_e0wcxqf",   
        "template_hw3yhlo",  
        event.target,        
        "Vl1AauOc0I_9JzZRc"       
      )
      .then(
        (result) => {
          alert("Message sent successfully!")
          console.log(result.text)
        },
        (error) => {
          alert("Failed to send message. Please try again.")
          console.error(error.text)
        }
      )
  }

  const handleProjectSelect = (projectId) => {
    setSelectedProject(projectId)
    window.scrollTo(0, 0)
  }

  const handleBackFromProject = () => {
    setSelectedProject(null)
    setIsReturningFromProject(true)
  }

  if (selectedProject) {
    const projectData = projectsData.find(p => p.id === selectedProject)
    return (
      <ProjectDescription 
        project={projectData} 
        onBack={handleBackFromProject} 
      />
    )
  }

  if (!mounted) {
    return null // Prevent hydration issues
  }

  return (
    <>
      {!isSidebarOpen && (
        <nav id="navbar" className={`${isScrolled ? 'drop' : ''}`}>
          <div className="flex items-center justify-between w-full">
            <div className="logo">
              <Image src="/assets/icons/logo.svg" alt="Logo" width={30} height={40} />
            </div>
            <div className="nav__routes hidden md:flex space-x-6">
              <a href="#header" className="route">Home</a>
              <a href="#about" className="route">About</a>
              <a href="#services" className="route">Interests</a>
              <a href="#projects" className="route">Projects</a>
              <a href="#contact" className="route">Contact</a>
            </div>
            <div className="navbar-controls">
              <label className="theme__toggle">
                <input type="checkbox" checked={theme === 'dark'} onChange={toggleTheme} className="hidden" />
                <div className="icon__container">
                  {theme === 'light' ? <Sun className="sun" /> : <Moon className="moon" />}
                </div>
              </label>
              <div className="icon__container menu__btn md:hidden">
                <Menu onClick={toggleSidebar} />
              </div>
            </div>
          </div>
        </nav>
      )}

      {isSidebarOpen && typeof window !== 'undefined' && createPortal(
        <aside className="sidebar visible">
          <div className="sidebar__wrapper">
            <div className="top">
              <div className="logo">
                <Image src="/assets/icons/logo.svg" alt="Logo" width={40} height={40} />
              </div>
              <div className="sidebar-controls">
                <label className="theme__toggle">
                  <input 
                    type="checkbox" 
                    checked={theme === 'dark'} 
                    onChange={toggleTheme} 
                    className="hidden" 
                  />
                  <div className="icon__container">
                    {theme === 'light' ? <Sun className="sun" /> : <Moon className="moon" />}
                  </div>
                </label>
                <button className="close-btn icon__container" onClick={toggleSidebar}>
                  <X />
                </button>
              </div>
            </div>
            <div className="middle navlinks">
              <a href="#header" className="navitem" onClick={toggleSidebar}>Home</a>
              <a href="#about" className="navitem" onClick={toggleSidebar}>About</a>
              <a href="#services" className="navitem" onClick={toggleSidebar}>Interests</a>
              <a href="#projects" className="navitem" onClick={toggleSidebar}>Projects</a>
              <a href="#contact" className="navitem" onClick={toggleSidebar}>Contact</a>
            </div>
          </div>
        </aside>,
        document.body
      )}

      <AnimateOnScroll animation="fade-down">
        <section id="header" className="bg__secondary relative min-h-screen">
          <div className="spotlight"></div>
          <div className="container" style={{ position: 'relative' }}>
            <div className="me" style={{ width: '100%', height: '100%', minHeight: '500px', position:'absolute' }}>
              <Spline scene="https://prod.spline.design/OXJlZSnAa9Zq9-Lu/scene.splinecode" />
            </div>
            <div className="grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', zIndex: 1, position: 'relative', pointerEvents: 'none' }}>
              <div className="empty"></div>
              <div className="user__info" style={{ textAlign: 'center'}}>
                <p className='text__muted' style={{ margin:'5px 0'}}>Yes, my name is</p>
                <h1 className="title" style={{ color: '#5100ff', fontWeight:'bold', margin:'5px 0'}}>Unique Shrestha</h1>
                <p className='text__muted' style={{ margin:'5px 0'}}>and I'm a</p>
                <div className="title">
                  <Typewriter
                    onInit={(typewriter) => {
                      typewriter
                        .typeString("Developer")
                        .pauseFor(1000)
                        .deleteAll()
                        .typeString("Designer")
                        .pauseFor(1000)
                        .start();
                    }}
                    options={{
                      loop: true,
                    }}
                  />
                </div>
                <div className="flex buttons" style={{ justifyContent: 'center' }}>
                  <div className="flex social__handles">
                    <a href="https://github.com/unique-stha" target="_blank" className="icon__container handle" style={{ pointerEvents: 'auto' }}>
                      <Image src="/assets/icons/github.svg" alt="GitHub" width={24} height={24} />
                    </a>
                    <a href="https://www.linkedin.com/in/unique-stha" target="_blank" className="icon__container handle" style={{ pointerEvents: 'auto' }}>
                      <Image src="/assets/icons/linkedin.svg" alt="LinkedIn" width={24} height={24} />
                    </a>
                  </div>
                  <a href="#contact" className="btn btn__primary" style={{ pointerEvents: 'auto' }}>Contact Me</a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </AnimateOnScroll>
      <AnimateOnScroll animation="fade-down">
      <section id="about">
        <div className="container grid">
          <div className="box self__start">
            <div className="spotlight"></div>
            <div className="cluster">
              <div className="flex user">
                <div className="profile">
                  <Image src="/assets/me.png" alt="Unique Shrestha" width={100} height={100} style={{
                    width: '100%',
                    height: 'auto',
                    objectFit: 'contain',
                  }} />
                </div>
                <div className="details">
                  <h4>Unique Shrestha</h4>
                  <p className="text__muted">Developer/Designer</p>
                </div>
              </div>
              <h2 className="sub__title">
                <span className="primary">Passionate</span> Developer and Lifelong Learner
              </h2>
              <p className="description">
              I embrace challenges, explore innovative solutions, and want to transform creative ideas into meaningful contributions to the ever-evolving digital world.
              </p>
            </div>
            <Image src="/assets/icons/window.svg" alt="Window" className="kit window" width={100} height={100} style={{width:'auto',heght:'auto', paddingTop:'300px',paddingLeft:'250px', position:'absolute'}} />
          </div>
          <div className="col-2 box">
            <div className="spotlight"></div>
            <div className="flex row cluster">
              <div className="code__block">
                <div className="flex__center dot__container">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
                <pre>
                  <code>
                    {`
    const developer = {
      firstName: "Unique",
      lastname: "Shrestha",
      aka: "Nick",
      hobby: () => {
        //eat();
        //sleep();
        //code();
        //repeat();
      }
    }
                    `}
                  </code>
                </pre>
              </div>
              <div className="my__drive">
                <h2 className="sub__title">
                  What <span className="primary">Drives Me</span>
                </h2>
                <p className="description">
                I find joy in constantly exploring new technologies💻 and pushing my boundaries. Each challenge is an opportunity to grow🌟, whether I'm diving into AI algorithms, crafting user-friendly applications, or designing intuitive interfaces. What drives me most is the desire to use my skills to make a positive impact🎯 - I want to create solutions that can help people overcome real-world problems and make their lives a bit🎨 easier. There's something incredibly fulfilling about transforming ideas into tools that can make a difference in someone's day-to-day life✨.
                </p>
              </div>
            </div>
            <Image src="/assets/icons/grid-wire-frame.svg" alt="Grid Wire Frame" className="kit grid_wireframe" width={100} height={100} />
          </div>
          <div className="col-2 box background-blur tech__box">
            <div className="cluster">
              <div className="column">
                <h2 className="sub__title">
                  My <span className="primary">tech Stack</span>
                </h2>
                <p className="description">Always Evolving My Tech Stack</p>
              </div>
              <div className="column stacks__container flex flex-wrap justify-center">
                {['react', 'typescript', 'nextjs', 'tailwindcss','adobe','javascript'].map((tech) => (
                  <div key={tech} className="flex__center btn stack m-1 p-2">
                    <Image src={`/assets/icons/${tech}.svg`} alt={tech} width={20} height={20} className="mr-2" />
                    <span className="text-sm">{tech.charAt(0).toUpperCase() + tech.slice(1)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="box flex__center last__box">
            <div className="cluster">
              <h2 className="text__white sub__title" style={{ textShadow: '3px 3px 8px rgba(0, 0, 0, 0.8)' }}>
                <span style={{fontSize:'15px'}}>FROM THE</span><br />TOP OF THE WORLD<br /><strong style={{ color: 'red', fontSize: '50px' }}>N<span style={{ color: 'white' }}>E</span>P<span style={{ color: 'white' }}>A</span>L</strong>
              </h2>
              <div className="flex__center btn__wrapper">
                <a href="#contact" className="btn">Lets Connect</a>
              </div>
            </div>
          </div>
        </div>
      </section>
      </AnimateOnScroll>
      <AnimateOnScroll animation="fade-down">
      <section id="services" className="bg__secondary">
        <div className="container">
          <div className="section__header">
            <h2 className="sub__title">
              My <span className="primary">Interests</span>
            </h2>
            <p className="description">
            “Nothing in life is to be feared, it is only to be understood. Now is the time to understand more, so that we may fear less.” - Marie Curie
            </p>
          </div>
          <div className="services">
            {['Machine Learning', 'Developing', 'Designing'].map((service, index) => (
              <div key={index} className="service">
                <div className="flex__center circle">
                  <div className="spotlight"></div>
                  <div className="icon__container">
                    <Image src={`/assets/icons/${service.toLowerCase().replace(/ /g, '-')}.png`} alt={service} width={40} height={40} style={{width:'60%',height:'60%',objectFit:'contain'}} />
                  </div>
                </div>
                <h3 className="name">{service}</h3>
                <p className="text__muted description">
                  {service === 'Machine Learning' && "I'm fascinated by how deep learning models like TensorFlow and PyTorch can tackle real-world problems. I've been experimenting with scikit-learn, Suppor Vector Machine (SVM) and NEAT algorithms for basic machine learning projects and recently started exploring Hugging Face's transformers library for natural language processing tasks."}
                  {service === 'Developing' && 'When it comes to development, I love bringing ideas to life through code. For web development, I work with React and Node.js for building dynamic applications. On the software development side, I enjoy using Python and Javascript for backend services and have been learning about microservices architecture using Docker and Kubernetes.'}
                  {service === 'Designing' && "Design is where I get to blend creativity with functionality. I use Figma for UI/UX prototyping and wireframing. I'm also exploring Adobe XD and have started learning about design systems to create more consistent and scalable interfaces. Recently, I've been particularly interested in responsive design principles and accessibility standards."}
                </p>
                <div className="flex__center">
                  <a href="#contact" className="btn">
                    Lets Talk <ArrowRight />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      </AnimateOnScroll>
      <AnimateOnScroll animation="fade-down">
      <section id="projects" ref={projectsSectionRef}>
        <div className="container">
          <div className="section__header">
            <h2 className="sub__title">My Recent Projects</h2>
            <p className="description">
              Explore my latest work, blending creativity and code for functional, responsive websites and applications.
            </p>
          </div>
          <div className="projects">
            {projectsData.map(project => (
              <div key={project.id} className="project">
                <div className="picture">
                  <Image 
                    src={project.image} 
                    alt={project.title} 
                    width={500} 
                    height={300}  
                    style={{
                      width: "auto", 
                      alignContent:"center", 
                      objectFit: "contain"
                    }} 
                  />
                </div>
                <div className="flex details">
                  <h3 className="line__clamp__1">{project.title}</h3>
                  <p className="text__muted description line__clamp__4">
                    {getProjectDescription(project.id)}
                  </p>
                  <div className="flex bottom">
                    <button onClick={() => handleProjectSelect(project.id)} className="flex__center btn">
                      <SquareArrowOutUpRight /> Continue Reading
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      </AnimateOnScroll>
      <AnimateOnScroll animation="fade-down">
      <section id="contact">
        <div className="container">
          <div className="left__column">
            <div className="box">
              <div className="cluster">
                <h2 className="sub__title">
                  Let's <span className="primary">create something</span> amazing together!
                </h2>
                <p className="description">Feel free to reach out for projects, collaborations, or web/app development inquiries via the form or email!</p>
              </div>
              <Image src="/assets/icons/list-option-ui.svg" alt="List UI" className="list__ui" width={100} height={100} style={{width:'100%',heght:'auto', paddingTop:'155px',paddingLeft:'350px', position:'absolute'}}/>
            </div>
            <div className="box">
              <div className="cluster">
                {[
                  { icon: "email", name: "Email", value: "unique-shrestha@outlook.com" },
                  { icon: "phone", name: "Phone", value: "+(508)5718325" },
                  { icon: "github", name: "Github", value: "unique-stha" }
                ].map((item, index) => (
                  <div key={index} className="flex option">
                    <div className="icon__container">
                      <Image src={`/assets/icons/${item.icon}.png`} alt={item.name} width={24} height={24} style={{width:'60%',height:'60%',objectFit:'contain'}} />
                    </div>
                    <div className="details">
                      <h3 className="name">{item.name}</h3>
                      <p className="text__muted value">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <form className="contact__form" onSubmit={sendEmail}>
            <div className="spotlight"></div>
            <h2 className="sub__title">
              Leave me a <span className="primary">Message!</span>
            </h2>
            <div className="row">
              <input type="text" placeholder="First name" name="firstname" className="control" required />
              <input type="text" placeholder="Last name" name="lastname" className="control" required />
            </div>
            <div className="row">
              <input type="email" placeholder="Email Address" name="email" className="control" required />
              <input type="tel" placeholder="Phone Number" name="phone" className="control" />
            </div>
            <textarea name="message" placeholder="Message" className="control" required></textarea>
            <button type="submit" className="btn btn__primary submit__btn">
              Send Now
            </button>
          </form>
        </div>
      </section>
      </AnimateOnScroll>
      <AnimateOnScroll animation="fade-up">
      <footer id="footer">
        <div className="spotlight"></div>
        <div className="container">
          <div className="flex__center logo items-center">
            <Image src="/assets/icons/logo.svg" alt="Logo" width={40} height={40} />
            <h1 className="flex__center name ml-4 text-2xl">Unique Shrestha</h1>
          </div>
          <div className="flex__center footer-tabs">
            <a href="#header" className="route__item">Home</a>
            <a href="#about" className="route__item">About</a>
            <a href="#services" className="route__item">Interests</a>
            <a href="#projects" className="route__item">Projects</a>
            <a href="#contact" className="route__item">Contact</a>
          </div>
          <div className="flex__center footer-handle-container">
          <a href="https://github.com/unique-stha" target="_blank" className="icon__container handle" style={{ pointerEvents: 'auto' }}>
                    <Image src="/assets/icons/github.svg" alt="GitHub" width={24} height={24} />
                  </a>
                  <a href="https://www.linkedin.com/in/unique-stha" target="_blank" className="icon__container handle" style={{ pointerEvents: 'auto' }}>
                    <Image src="/assets/icons/linkedin.svg" alt="LinkedIn" width={24} height={24} />
                  </a>
          </div>
          <div className="flex__center copyright ">
            <p className="text__muted">Made with 💜 using React</p>
            <h3>Copyright © 2024 Mr. Unique. All rights reserved.</h3>
          </div>
        </div>
      </footer>
      </AnimateOnScroll>
    </>
  );
};

export default HomePage;