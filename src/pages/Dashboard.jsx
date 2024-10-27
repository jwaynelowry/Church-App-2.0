import React from 'react';
import { Users, Building2, ShieldCheck, Activity } from 'lucide-react';
import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import { useStats } from '../hooks/useStats';
import { StatCard } from '../components/StatCard';
import { LoadingCard } from '../components/LoadingCard';

export function Dashboard() {
  const { user, runMigrations } = useAuth();
  const { 
    totalUsers, 
    totalChurches, 
    totalAdmins,
    recentActivity,
    userGrowth,
    churchGrowth,
    adminGrowth,
    loading,
    error 
  } = useStats();

  const [migrationStatus, setMigrationStatus] = React.useState(null);

  const handleRunMigrations = async () => {
    try {
      const results = await runMigrations();
      setMigrationStatus({
        success: true,
        message: `Migration completed successfully. Users: ${results.users.migratedCount} migrated, ${results.users.skippedCount} skipped. Churches: ${results.churches.migratedCount} migrated, ${results.churches.skippedCount} skipped.`
      });
    } catch (error) {
      setMigrationStatus({
        success: false,
        message: `Migration failed: ${error.message}`
      });
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <p className="text-red-700">Error loading dashboard: {error}</p>
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Users',
      value: loading ? '-' : totalUsers,
      icon: Users,
      trend: `${userGrowth.toFixed(2)}%`,
      trendUp: userGrowth > 0,
      color: 'indigo'
    },
    {
      label: 'Total Churches',
      value: loading ? '-' : totalChurches,
      icon: Building2,
      trend: `${churchGrowth.toFixed(2)}%`,
      trendUp: churchGrowth > 0,
      color: 'emerald'
    },
    {
      label: 'Total Admins',
      value: loading ? '-' : totalAdmins,
      icon: ShieldCheck,
      trend: `${adminGrowth.toFixed(2)}%`,
      trendUp: adminGrowth > 0,
      color: 'purple'
    },
    {
      label: 'Recent Activity',
      value: loading ? '-' : recentActivity,
      icon: Activity,
      color: 'blue'
    }
  ];

  return (
    <div className="space-y-6">
      {user?.role === 'admin' && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Database Maintenance
          </h2>
          <div className="space-y-4">
            <Button onClick={handleRunMigrations}>
              Run Database Migrations
            </Button>
            {migrationStatus && (
              <div className={`mt-4 p-4 rounded-md ${
                migrationStatus.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {migrationStatus.message}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          Array(4).fill(null).map((_, index) => (
            <LoadingCard key={index} />
          ))
        ) : (
          stats.map((stat, index) => (
            <StatCard
              key={index}
              label={stat.label}
              value={stat.value}
              icon={stat.icon}
              trend={stat.trend}
              trendUp={stat.trendUp}
              color={stat.color}
            />
          ))
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h2>
        {loading ? (
          <div className="animate-pulse space-y-4">
            {Array(3).fill(null).map((_, index) => (
              <div key={index} className="h-12 bg-gray-100 rounded"></div>
            ))}
          </div>
        ) : (
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
            <p className="text-gray-500">Activity content goes here</p>
          </div>
        )}
      </div>
    </div>
  );
}