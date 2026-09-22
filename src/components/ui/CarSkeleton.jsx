export default function CarSkeleton() {
  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: 16,
        overflow: 'hidden',
        border: '1.5px solid #E2E8F0',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        boxShadow: '0 4px 18px rgba(15, 23, 42, 0.04)',
      }}
    >
      <div className="skeleton" style={{ width: '100%', height: 200 }} />
      <div style={{ padding: '14px 14px 8px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div className="skeleton" style={{ width: '75%', height: 20, borderRadius: 6 }} />
        <div className="skeleton" style={{ width: '45%', height: 14, borderRadius: 4 }} />
      </div>
      <div style={{ padding: '10px 14px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F1F5F9' }}>
        <div>
          <div className="skeleton" style={{ width: 70, height: 20, borderRadius: 4 }} />
          <div className="skeleton" style={{ width: 50, height: 10, marginTop: 4, borderRadius: 3 }} />
        </div>
        <div className="skeleton" style={{ width: 95, height: 32, borderRadius: 999 }} />
      </div>
    </div>
  );
}
