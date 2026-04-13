import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'
import { NextResponse } from 'next/server'

export async function GET() {
  const auth = await requireAdmin()
  if (auth.error) return auth.error

  try {
    const [
      totalStudents, totalCourses, totalEnrollments,
      totalRevenue, recentEnrollments, recentPayments,
    ] = await Promise.all([
      prisma.profile.count({ where: { role: 'STUDENT' } }),
      prisma.course.count(),
      prisma.enrollment.count({ where: { status: { in: ['ACTIVE', 'COMPLETED'] } } }),
      prisma.payment.aggregate({
        where: { status: 'CAPTURED' },
        _sum: { amount: true },
      }),
      prisma.enrollment.findMany({
        orderBy: { enrolledAt: 'desc' },
        take: 5,
        include: {
          user: { select: { name: true, email: true } },
          course: { select: { title: true } },
        },
      }),
      prisma.payment.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          user: { select: { name: true } },
          course: { select: { title: true } },
        },
      }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        totalStudents,
        totalCourses,
        totalEnrollments,
        totalRevenuePaise: totalRevenue._sum.amount ?? 0,
        recentEnrollments,
        recentPayments,
      },
    })
  } catch (error) {
    console.error('[GET /api/admin/stats]', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch stats' }, { status: 500 })
  }
}
