import Hero1 from '#/components/ui/8bit/blocks/hero1'
import { createFileRoute } from '@tanstack/react-router'
import FormUrl from '#/components/Form'
import ListUrlShorted from '#/components/ListUrlShorted'
import SAMPLE_URLS from '#/lib/sampleUrls'

export const Route = createFileRoute('/')({ component: App })

function App() {

  return (
    <main className="container mx-auto max-h-screen overflow-hidden">
      <Hero1 title="shortener" className="h-screen" subtitle="make your link short a quick">
        <div className="container flex flex-col justify-between items-center h-full py-8 gap-y-6">
          <section id="form" className="w-full flex justify-center">
            <FormUrl />
          </section>

          {SAMPLE_URLS && (
            <section id="card" className="w-full max-w-3xl mb-6">
              <div className="mx-auto">
                <ListUrlShorted items={SAMPLE_URLS} onDelete={() => { console.log("hello"); }} />
              </div>
            </section>
          )}

        </div>
      </Hero1>
    </main>
  );
}
