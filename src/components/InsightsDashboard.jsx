import { useState } from 'react';
import { Card, Col, Empty, Row, Select, Slider, Space, Statistic, Typography } from 'antd';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useCountryMetrics, useJobTitleAverages, useSalaryHistogram } from '../hooks/useInsights.js';

const { Title, Text } = Typography;

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export default function InsightsDashboard() {
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [bucketCount, setBucketCount] = useState(5);

  const { data: countriesResponse, isLoading: loadingCountries } = useCountryMetrics();
  const { data: jobTitlesResponse, isLoading: loadingJobTitles } = useJobTitleAverages(selectedCountry);
  const { data: histogramResponse, isLoading: loadingHistogram } = useSalaryHistogram(selectedCountry, bucketCount);

  const countries = countriesResponse?.data ?? [];
  const jobTitlesData = jobTitlesResponse?.data ?? [];
  const histogramData = histogramResponse?.data ?? [];

  // Find selected country metrics from general metrics list
  const selectedMetrics = countries.find((c) => c.country === selectedCountry);

  const handleCountryChange = (value) => {
    setSelectedCountry(value);
  };

  const formattedHistogramData = histogramData.map((b) => ({
    range: `${currency.format(b.min)} - ${currency.format(b.max)}`,
    Count: b.count,
    Average: Math.round(b.avgSalary),
  }));

  const formattedJobTitlesData = jobTitlesData.map((j) => ({
    jobTitle: j.jobTitle,
    Average: Math.round(j.avgSalary),
    Count: j.count,
  }));

  const selectOptions = countries.map((c) => ({
    value: c.country,
    label: c.country,
  }));

  const hasData = countries.length > 0;

  if (!loadingCountries && !hasData) {
    return (
      <Card style={{ margin: '2rem', textAlign: 'center' }}>
        <Empty description="No telemetry data available. Make sure the database is seeded." />
      </Card>
    );
  }

  return (
    <div className="insights-dashboard" style={{ padding: '1rem 0' }}>
      <Space wrap style={{ marginBottom: '1.5rem', justifyContent: 'space-between', width: '100%' }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>Salary Analytics Telemetry</Title>
          <Text type="secondary">Explore corporate payroll distributions and aggregation statistics</Text>
        </div>
        <Space wrap>
          <Text strong>Selected Country:</Text>
          <Select
            value={selectedCountry}
            onChange={handleCountryChange}
            loading={loadingCountries}
            style={{ width: 120 }}
            options={selectOptions.length ? selectOptions : [{ value: 'US', label: 'US' }]}
            placeholder="Select Country"
            aria-label="Select country for salary analytics"
          />
        </Space>
      </Space>

      {/* Summary KPI Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '2rem' }}>
        <Col xs={12} sm={6}>
          <Card bordered={false} className="insights-card">
            <Statistic
              title="Average Salary"
              value={selectedMetrics?.avgSalary ?? 0}
              formatter={(value) => currency.format(value)}
              valueStyle={{ color: '#3b82f6' }}
              loading={loadingCountries}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} className="insights-card">
            <Statistic
              title="Min Salary"
              value={selectedMetrics?.minSalary ?? 0}
              formatter={(value) => currency.format(value)}
              valueStyle={{ color: '#10b981' }}
              loading={loadingCountries}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} className="insights-card">
            <Statistic
              title="Max Salary"
              value={selectedMetrics?.maxSalary ?? 0}
              formatter={(value) => currency.format(value)}
              valueStyle={{ color: '#f59e0b' }}
              loading={loadingCountries}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} className="insights-card">
            <Statistic
              title="Total Roster"
              value={selectedMetrics?.count ?? 0}
              valueStyle={{ color: '#8b5cf6' }}
              loading={loadingCountries}
            />
          </Card>
        </Col>
      </Row>

      {/* Visual Charts Section */}
      <Row gutter={[16, 16]}>
        {/* Job Title Averages */}
        <Col xs={24} lg={12}>
          <Card title="Average Salary by Job Title" className="chart-card" loading={loadingJobTitles}>
            {formattedJobTitlesData.length === 0 ? (
              <Empty description="No job title data found" style={{ height: 300, display: 'flex', flexDirection: 'column', justifyContent: 'center' }} />
            ) : (
              <div style={{ width: '100%', height: 350 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={formattedJobTitlesData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a3658" />
                    <XAxis
                      dataKey="jobTitle"
                      stroke="#94a3b8"
                      tick={{ fill: '#94a3b8' }}
                      angle={-25}
                      textAnchor="end"
                      height={50}
                    />
                    <YAxis
                      stroke="#94a3b8"
                      tickFormatter={(v) => `$${v / 1000}k`}
                      tick={{ fill: '#94a3b8' }}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#151d33', borderColor: '#2a3658', color: '#e8edf7' }}
                      formatter={(value) => [currency.format(value), 'Avg Salary']}
                    />
                    <Legend wrapperStyle={{ paddingTop: 10 }} />
                    <Bar dataKey="Average" name="Average Salary" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>
        </Col>

        {/* Salary Distribution Histogram */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <span>Salary Distribution Histogram</span>
                <div style={{ width: 150, paddingRight: 10, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 'normal', color: '#94a3b8' }}>Bins: {bucketCount}</span>
                  <Slider
                    min={2}
                    max={15}
                    value={bucketCount}
                    onChange={setBucketCount}
                    style={{ flexGrow: 1, margin: 0 }}
                  />
                </div>
              </div>
            }
            className="chart-card"
            loading={loadingHistogram}
          >
            {formattedHistogramData.length === 0 ? (
              <Empty description="No distribution data found" style={{ height: 300, display: 'flex', flexDirection: 'column', justifyContent: 'center' }} />
            ) : (
              <div style={{ width: '100%', height: 350 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={formattedHistogramData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a3658" />
                    <XAxis
                      dataKey="range"
                      stroke="#94a3b8"
                      tick={{ fill: '#94a3b8' }}
                      angle={-25}
                      textAnchor="end"
                      height={50}
                    />
                    <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#151d33', borderColor: '#2a3658', color: '#e8edf7' }}
                      formatter={(value, name) => [name === 'Average' ? currency.format(value) : value, name]}
                    />
                    <Legend wrapperStyle={{ paddingTop: 10 }} />
                    <Bar dataKey="Count" name="Employee Count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
