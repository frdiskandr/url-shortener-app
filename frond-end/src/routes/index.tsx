import Hero1 from '#/components/ui/8bit/blocks/hero1'
import { createFileRoute } from '@tanstack/react-router'
import FormUrl from '#/components/Form'
import ListUrlShorted from '#/components/ListUrlShorted'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ToastProvider } from '#/components/ui/8bit/toast'

export const backendUrl = (import.meta as any).env?.VITE_BACKEND_URL || (import.meta as any).env?.BACKEND_URL || 'https://shortener-rosy.vercel.app'

export const Route = createFileRoute('/')({ component: App })

function App() {
  const queryClient = useQueryClient()

  const { data, isPending, error } = useQuery({
    queryKey: ["urls"],
    queryFn: () =>
      fetch(`${backendUrl}/all?userID=1`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((r) => {
        if (!r.ok) throw new Error(`Failed to load urls: ${r.status}`)
        return r.json()
      }).then((payload) => payload.data),
  })

  return (
    <ToastProvider>
      <main className="container mx-auto max-h-screen overflow-hidden">
        <Hero1 title="shortener" className="h-screen" subtitle="Quickly shorten any link">
          <div className="container flex flex-col justify-between items-center h-full py-8 gap-y-6">
            <section id="form" className="w-full flex justify-center">
              <FormUrl onSuccess={() => queryClient.invalidateQueries({ queryKey: ['urls'] })} />
            </section>

            {data && (
              <section id="card" className="w-full max-w-3xl mb-6">
                <div className="mx-auto">
                  <ListUrlShorted items={data} onDelete={() => { console.log("hello"); }} />
                </div>
              </section>
            )}

          </div>
        </Hero1>
      </main>
    </ToastProvider>
  );
}
