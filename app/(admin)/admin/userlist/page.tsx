"use client"

import { useEffect, useState } from "react"

type User = {
  firstName: string
  lastName: string
  phoneNumber: string
  melliCode: string
    mdStatus: string
    dateOfRegister: Date

}

export default function UserList() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/admin/userslist")
        const data = await res.json()
        console.log(data);
        if (res.ok) {
          setUsers(data.users)
        } else {
          console.error("Failed to fetch users", data)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">لیست کاربران</h1>

      {loading ? (
        <p>در حال بارگذاری...</p>
      ) : (
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full text-right table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">شناسه</th>
                <th className="px-4 py-2">نام</th>
                <th className="px-4 py-2">نام خانوادگی</th>
                <th className="px-4 py-2">شماره تماس</th>
                <th className="px-4 py-2">کد ملی</th>
                 <th className="px-4 py-2">وضعیت تحصیلی</th>
                 <th className="px-4 py-2">تاریخ عضویت</th>

              </tr>                    

            </thead>
<tbody>
  {users.map((user, index) => (
    <tr key={user.phoneNumber} className="even:bg-gray-50">
      {/* Index + 1 to start from 1 instead of 0 */}
      <td className="border px-4 py-2">{index + 1}</td>
      <td className="border px-4 py-2">{user.firstName}</td>
      <td className="border px-4 py-2">{user.lastName}</td>
      <td className="border px-4 py-2">{user.phoneNumber}</td>
      <td className="border px-4 py-2">{user.melliCode}</td>
      <td className="border px-4 py-2">{user.mdStatus}</td>
      <td className="border px-4 py-2">{new Date(user.dateOfRegister).toLocaleDateString("fa-IR")}</td>
    </tr>
  ))}
</tbody>

          </table>
        </div>
      )}
    </div>
  )
}
