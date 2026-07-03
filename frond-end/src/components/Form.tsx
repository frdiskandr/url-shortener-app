import { useForm } from '@tanstack/react-form'
import { Input } from './ui/8bit/input'
import { Button } from './ui/8bit/button'

export default function FormUrl() {
  const form = useForm({
    defaultValues: { url: '' },
    onSubmit: ({ value }) => {
      alert(JSON.stringify(value, null, 2))
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
            /^https?:\/\//i.test(value) ? undefined : 'Must be Https://',
        }}
        children={(field) => (
          <>
            {!field.state.meta.isValid && (
              <em>{field.state.meta.errors.join(', ')}</em>
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
        )}
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