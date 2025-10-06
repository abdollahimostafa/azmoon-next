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

export default function ExamRegistrations({ params }: { params: Promise<{ id: string }> })  {
    const { id: examId } = use(params)
  

  const [users, setUsers] = useState<RegisteredUser[]>([])
  const [loading, setLoading] = useState(true)
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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">کاربران ثبت نام شده در آزمون</h1>

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
                <th className="border px-4 py-2">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, idx) => (
                <tr key={u.id} className="even:bg-gray-50">
                  <td className="border px-4 py-2 text-center">{idx + 1}</td>
                  <td className="border px-4 py-2">{u.user.firstName} {u.user.lastName}</td>
                  <td className="border px-4 py-2 whitespace-nowrap">{u.user.phoneNumber}</td>
                  <td className="border px-4 py-2">
                    <button
                      className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                      onClick={() => router.push(`/admin/karnameh/${examId}/${u.user.id}`)}
                    >
                      مشاهده کارنامه
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
