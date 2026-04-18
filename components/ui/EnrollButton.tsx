'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import InterestModal from './InterestModal'
import type { ComponentProps } from 'react'

type ButtonProps = ComponentProps<typeof Button>

export default function EnrollButton({ children, onClick: _onClick, ...props }: ButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button {...props} onClick={() => setIsOpen(true)}>
        {children}
      </Button>
      <InterestModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
