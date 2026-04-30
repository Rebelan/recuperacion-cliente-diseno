import React, { useEffect } from 'react'
import { Navbar } from '../components/layout/Navbar'
import { Hero } from '../components/landing/Hero'
import { CollectionSection } from '../components/landing/CollectionSection'
import { AuthSection } from '../components/landing/AuthSection'
import { Footer } from '../components/layout/Footer'

export const Landing = () => {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>("[data-reveal]")

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible")
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.15,
      }
    )

    elements.forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [])

  return (
    <>
      <Navbar />
      <main className='bg-black text-white'>
        <Hero />
        <CollectionSection />
        <AuthSection />
      </main>
      <Footer />
    </>
  )
}