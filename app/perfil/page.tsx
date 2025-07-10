import { ProfileManager } from "@/components/auth/profile-manager"

export default function ProfilePage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Meu Perfil</h1>
      </div>
      <ProfileManager />
    </div>
  )
}
