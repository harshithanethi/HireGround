import { Card } from "../../components/ui/Card"

export default function AdminSettings() {
  return (
    <div className="px-6 md:px-10 py-8 space-y-6 max-w-screen-xl mx-auto">
      <div className="mb-2">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Settings</h1>
        <p className="text-gray-500 font-medium mt-1">Placeholder.</p>
      </div>
      <Card className="p-8">
        <div className="text-gray-900 font-black">Coming soon</div>
        <div className="text-gray-500 font-medium mt-2">Add org settings, roles, audit exports, and SSO here.</div>
      </Card>
    </div>
  )
}

