'use client'

import React, { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const AnimateOnScroll = ({ children, animation = 'fade-up', duration = 0.6, delay = 0.1 }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  const variants = {
    hidden: {
      opacity: 0,
      y: animation.includes('up') ? 20 : animation.includes('down') ? -20 : 0,
      x: animation.includes('left') ? 20 : animation.includes('right') ? -20 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
    },
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      transition={{ duration, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}

export default AnimateOnScroll