import React from 'react'
import { Navbar } from '../components/layout/Navbar'
import { Hero } from '../components/landing/Hero'
import { CollectionSection } from '../components/landing/CollectionSection'
import { AuthSection } from '../components/landing/AuthSection'
import { Footer } from '../components/layout/Footer'

export const Landing = () => {
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
