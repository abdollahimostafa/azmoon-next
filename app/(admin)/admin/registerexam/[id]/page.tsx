"use client"
import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type RegisteredUser = {
  id: string
  user: {
    id: string
    firstName: string
    lastName: string
    phoneNumber: string
  }
}

export default function ExamRegistrations({ params }: { params: Promise<{ id: string }> }) {
  const { id: examId } = use(params)
  const [users, setUsers] = useState<RegisteredUser[]>([])
  const [loading, setLoading] = useState(true)
  const [removing, setRemoving] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchRegistrations() {
      try {
        const res = await fetch(`/api/admin/registerexam/${examId}`)
        const data = await res.json()
        setUsers(data.registrations || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchRegistrations()
  }, [examId])

  async function handleRemove(userId: string) {
    const confirmDelete = window.confirm("آیا از حذف این کاربر از آزمون مطمئن هستید؟")
    if (!confirmDelete) return

    try {
      setRemoving(userId)
      const res = await fetch(`/api/admin/registerexam/${examId}/delete?userId=${userId}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("خطا در حذف کاربر")

      // ✅ Update local state
      setUsers((prev) => prev.filter((u) => u.user.id !== userId))
      alert("کاربر با موفقیت حذف شد ✅")
    } catch (err) {
      console.error(err)
      alert("خطایی رخ داد. دوباره تلاش کنید.")
    } finally {
      setRemoving(null)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">کاربران ثبت‌نام‌شده در آزمون</h1>

      {loading ? (
        <p>در حال بارگذاری...</p>
      ) : users.length === 0 ? (
        <p>کاربری ثبت نام نکرده است.</p>
      ) : (
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full table-auto text-right">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-center">ردیف</th>
                <th className="border px-4 py-2">نام و نام خانوادگی</th>
                <th className="border px-4 py-2">شماره تلفن</th>
                <th className="border px-4 py-2 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, idx) => (
                <tr key={u.id} className="even:bg-gray-50">
                  <td className="border px-4 py-2 text-center">{idx + 1}</td>
                  <td className="border px-4 py-2">{u.user.firstName} {u.user.lastName}</td>
                  <td className="border px-4 py-2 whitespace-nowrap">{u.user.phoneNumber}</td>
                  <td className="border px-4 py-2 flex gap-2 justify-center">
                    <button
                      className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                      onClick={() => router.push(`/admin/karnameh/${examId}/${u.user.id}`)}
                    >
                      مشاهده کارنامه
                    </button>

                    <button
                      className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50"
                      disabled={removing === u.user.id}
                      onClick={() => handleRemove(u.user.id)}
                    >
                      {removing === u.user.id ? "..." : "حذف"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
