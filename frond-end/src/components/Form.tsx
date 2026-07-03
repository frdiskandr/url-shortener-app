import React from 'react'
import { useForm } from '@tanstack/react-form'
import { Input } from './ui/8bit/input'
import { Button } from './ui/8bit/button'
import { useToast } from './ui/8bit/toast'

type FormUrlProps = {
  onSuccess?: () => void
}

export default function FormUrl({ onSuccess }: FormUrlProps) {
  const backendUrl = (import.meta as any).env?.VITE_BACKEND_URL || (import.meta as any).env?.BACKEND_URL || 'http://localhost:3030'

  const { toast } = useToast()

  const urlFieldRef = React.useRef<any>(null)

  const form = useForm({
    defaultValues: { url: '' },
    onSubmit: async ({ value }) => {
      try {
        const response = await fetch(`${backendUrl}/shorted`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: value.url,
            user_id: 1,
          }),
        })

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`)
        }

        const result = await response.json()
        console.log('Shortened response:', result)
        // show success toast
        toast('URL shortened successfully')
        // clear input via the field API
        urlFieldRef.current?.handleChange('')
        onSuccess?.()
      } catch (error) {
        console.error('Failed to submit URL:', error)
      }
    },
  })

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()
        form.handleSubmit()
      }}
    >
      <form.Field
        name="url"
        validators={{
          onChange: ({ value }) =>
            /^https?:\/\//i.test(value)
              ? undefined
              : 'URL must start with https://',
        }}
        children={(field) => {
          // keep a ref to the field API so we can clear it after submit
          urlFieldRef.current = field
          return (
            <>
              {!field.state.meta.isValid && (
                <em>Please enter a valid URL starting with http:// or https://</em>
              )}
              <Input
                value={field.state.value}
                name={field.name}
                type="text"
                placeholder='https://'
                onBlur={field.handleBlur}
                onChange={(event) =>
                  field.handleChange(event.target.value)
                }
              />
            </>
          )
        }}
      />
      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) => (
          <Button className='cursor-pointer' type="submit" disabled={!canSubmit}>
            {isSubmitting ? '...' : 'Submit!'}
          </Button>
        )}
      />
    </form>
  )
}