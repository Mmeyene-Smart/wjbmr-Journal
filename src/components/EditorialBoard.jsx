import React from 'react';
import { Mail, ShieldCheck, Award, BookOpen, Users, MapPin } from 'lucide-react';

export default function EditorialBoard() {
  const EDITORIAL_MEMBERS = [
    {
      name: 'Prof. Anietie E. Moses',
      role: 'Editor-in-Chief',
      specialty: 'Medical Microbiology & Parasitology',
      institution: 'College of Health Sciences, University of Uyo, Nigeria',
      email: 'wjbmr2014@gmail.com'
    },
    {
      name: 'Prof. Friday E. Okonofua',
      role: 'Associate Editor',
      specialty: 'Obstetrics & Gynaecology',
      institution: 'College of Health Sciences, University of Uyo, Nigeria',
      email: 'wjbmr2014@gmail.com'
    },
    {
      name: 'Dr. Emem A. Bassey',
      role: 'Managing Editor',
      specialty: 'Clinical Pharmacology & Therapeutics',
      institution: 'College of Health Sciences, University of Uyo, Nigeria',
      email: 'wjbmr2014@gmail.com'
    },
    {
      name: 'Prof. Eme F. Archibong',
      role: 'Editorial Adviser',
      specialty: 'Biomedical Pathology',
      institution: 'University of Calabar, Nigeria',
      email: 'wjbmr2014@gmail.com'
    },
    {
      name: 'Prof. Bassey S. Umoh',
      role: 'Editorial Board Member',
      specialty: 'Human Physiology',
      institution: 'University of Uyo, Nigeria',
      email: 'wjbmr2014@gmail.com'
    },
    {
      name: 'Prof. Grace O. Akinola',
      role: 'Editorial Board Member',
      specialty: 'Clinical Biochemistry',
      institution: 'Obafemi Awolowo University, Ile-Ife, Nigeria',
      email: 'wjbmr2014@gmail.com'
    }
  ];

  const borderColors = [
    'var(--accent-color)',
    'var(--primary-color)',
    'var(--primary-color)',
    'var(--text-muted)',
    'var(--primary-color)',
    'var(--primary-color)',
  ];

  return (
    <div className="container">
      {/* Page Header */}
      <div style={{ marginBottom: '40px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex',
          backgroundColor: 'var(--primary-light)',
          color: 'var(--primary-color)',
          padding: '8px 16px',
          borderRadius: 'var(--radius-full)',
          fontSize: '13px',
          fontWeight: '700',
          marginBottom: '16px',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Users size={16} /> Editorial Governance
        </div>
        <h2 style={{ fontSize: '32px', color: 'var(--primary-dark)', marginBottom: '12px' }}>
          Board of Editors
        </h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto', fontSize: '15px' }}>
          Meet the distinguished international scholars, researchers, and clinicians directing the peer review process, ethical standards, and academic publication quality at WJBMR.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: '32px' }} className="responsive-home-grid">

        {/* Editorial Directory Grid */}
        <div>
          <h3 className="section-title">Board Directory</h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '24px',
            marginTop: '24px'
          }}>
            {EDITORIAL_MEMBERS.map((member, idx) => (
              <div
                key={idx}
                className="glass-card"
                style={{
                  padding: '24px',
                  borderTop: `4px solid ${borderColors[idx % borderColors.length]}`,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  margin: 0,
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '';
                }}
              >
                <div>
                  <span style={{
                    fontSize: '10px',
                    backgroundColor: 'var(--primary-light)',
                    color: 'var(--primary-color)',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {member.role}
                  </span>

                  <h4 style={{ fontSize: '17px', color: 'var(--primary-dark)', marginTop: '12px', marginBottom: '4px' }}>
                    {member.name}
                  </h4>

                  <div style={{ fontSize: '13px', color: 'var(--primary-color)', fontWeight: '600', marginBottom: '8px' }}>
                    {member.specialty}
                  </div>

                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4', display: 'flex', alignItems: 'start', gap: '4px' }}>
                    <MapPin size={12} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--text-muted)' }} />
                    {member.institution}
                  </div>
                </div>

                <div style={{
                  borderTop: '1px solid var(--border-color)',
                  paddingTop: '12px',
                  marginTop: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12px'
                }}>
                  <Mail size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                  <a href={`mailto:${member.email}`} style={{ color: 'var(--text-muted)', wordBreak: 'break-all' }}>{member.email}</a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', color: 'var(--primary-dark)' }}>
              Governance Standards
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '16px' }}>
              The board ensures all articles meet COPE (Committee on Publication Ethics) standards and adhere to international peer-review best practices.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { icon: ShieldCheck, label: 'Double-blind Peer Review' },
                { icon: Award, label: 'COPE Member Guidelines' },
                { icon: BookOpen, label: 'Open Access Compliance' },
              ].map(({ icon: Icon, label }, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-dark)' }}>
                  <Icon size={16} style={{ color: 'var(--primary-color)', flexShrink: 0 }} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card" style={{ padding: '24px', backgroundColor: 'var(--primary-light)', borderColor: 'var(--accent-light)' }}>
            <h3 style={{ fontSize: '16px', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Mail size={18} /> Editorial Office
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-dark)', lineHeight: '1.5' }}>
              For editorial inquiries, board nominations, or review invitations:
            </p>
            <a href="mailto:wjbmr2014@gmail.com" style={{ fontSize: '13px', color: 'var(--primary-color)', fontWeight: 'bold', marginTop: '8px', display: 'block' }}>
              wjbmr2014@gmail.com
            </a>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
              College of Health Sciences,<br />University of Uyo, Nigeria
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
