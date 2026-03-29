const BASE = 'https://api.jolpica.com/ergast/v1/f1/current'

export async function GET() {
  try {
    const [dRes, cRes, sRes, lRes] = await Promise.all([
      fetch(`${BASE}/driverStandings.json`,     { next: { revalidate: 60 } }),
      fetch(`${BASE}/constructorStandings.json`, { next: { revalidate: 60 } }),
      fetch(`${BASE}.json`,                      { next: { revalidate: 3600 } }),
      fetch(`${BASE}/last/results.json`,         { next: { revalidate: 60 } }),
    ])

    if (!dRes.ok || !cRes.ok || !sRes.ok || !lRes.ok) {
      throw new Error('upstream error')
    }

    const [drivers, constructors, schedule, lastRace] = await Promise.all([
      dRes.json(), cRes.json(), sRes.json(), lRes.json(),
    ])

    return Response.json({ drivers, constructors, schedule, lastRace })
  } catch {
    return Response.json({ error: true }, { status: 502 })
  }
}
