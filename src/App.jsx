import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider, Tabs, theme } from 'antd';
import EmployeeTable from './components/EmployeeTable.jsx';
import InsightsDashboard from './components/InsightsDashboard.jsx';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1 },
  },
});

export default function App() {
  const tabItems = [
    {
      key: 'roster',
      label: 'Employee Roster',
      children: <EmployeeTable />,
    },
    {
      key: 'insights',
      label: 'Salary Insights',
      children: <InsightsDashboard />,
    },
  ];

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
        <div className="app">
          <header className="app__header">
            <h1>Enterprise Salary Management</h1>
            <p>HR roster &amp; salary analytics</p>
          </header>
          <main className="app__main">
            <Tabs defaultActiveKey="roster" items={tabItems} className="app__tabs" />
          </main>
        </div>
      </ConfigProvider>
    </QueryClientProvider>
  );
}
