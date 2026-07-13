import React from 'react';
import { Mail, ShieldCheck, Award, BookOpen, Users, MapPin } from 'lucide-react';

export default function EditorialBoard() {
  const EDITORIAL_MEMBERS = [
    {
      name: 'Prof. Emmanuel Olu Megbelayin',
      role: 'Editor-In-Chief',
      specialty: 'Department of Ophthalmology',
      institution: 'University of Uyo, Uyo',
      email: 'favouredolu@yahoo.com'
    },
    {
      name: 'Prof. Timothy Ekwere',
      role: 'Deputy Editor-In-Chief',
      specialty: 'Department of Haematology',
      institution: 'University of Uyo, Uyo',
      email: 'timothyekwere@yahoo.com'
    },
    {
      name: 'Prof. Felix Uduma',
      role: 'Promotion/Marketing Editor',
      specialty: 'Department of Radiology',
      institution: 'University of Uyo, Uyo',
      email: 'felixuduma@yahoo.com'
    },
    {
      name: 'Dr. Agantem Ekuma',
      role: 'Secretary of the Board',
      specialty: 'Department of Medical Microbiology & Parasitology',
      institution: 'University of Uyo, Uyo',
      email: 'agantemekuma@uniuyo.edu.ng'
    },
    {
      name: 'Prof. Dianabasi Eduwem',
      role: 'Editorial Board Member',
      specialty: 'Department of Radiology',
      institution: 'University of Uyo, Uyo',
      email: 'eduwemjoy@yahoo.com'
    },
    {
      name: 'Prof. Eyo Ekpe',
      role: 'Editorial Board Member',
      specialty: 'Department of Surgery',
      institution: 'University of Uyo, Uyo',
      email: 'docekpe@yahoo.com'
    },
    {
      name: 'Prof. Enobong Ikpeme',
      role: 'Editorial Board Member',
      specialty: 'Department of Paediatrics',
      institution: 'University of Uyo, Uyo',
      email: 'enpeks@yahoo.com'
    },
    {
      name: 'Prof. Anietie E. Moses',
      role: 'Editorial Board Member',
      specialty: 'Dept. of Medical Microbiology & Parasitology',
      institution: 'University of Uyo, Uyo',
      email: 'anietiemoses@uniuyo.edu.ng, amoses264@gmail.com'
    },
    {
      name: 'Prof. Inyang A. Atting',
      role: 'Editorial Board Member',
      specialty: 'Dept. of Medical Microbiology & Parasitology',
      institution: 'University of Uyo',
      email: 'dr_atting@yahoo.com'
    },
    {
      name: 'Prof. Aniekan Abasiattai',
      role: 'Editorial Board Member',
      specialty: 'Department of Obstetrics & Gynaecology',
      institution: 'University of Uyo, Uyo',
      email: 'animan74@yahoo.com'
    },
    {
      name: 'Prof. Timothy Nottidge',
      role: 'Editorial Board Member',
      specialty: 'Department of Orthopaedics',
      institution: 'University of Uyo, Uyo',
      email: 'timnottidge@yahoo.com'
    },
    {
      name: 'Itohowo Ebong',
      role: 'Editorial Assistant',
      specialty: 'Institute of Health Research and Development',
      institution: 'University of Uyo Teaching Hospital, Uyo',
      email: 'ebongitohowo@gmail.com'
    },
    {
      name: 'Prof. Joseph J. Andy',
      role: 'Editorial Adviser',
      specialty: 'Department of Internal Medicine',
      institution: 'University of Uyo, Uyo',
      email: 'andyumanah@gmail.com'
    },
    {
      name: 'Prof. Paul Ekwere',
      role: 'Editorial Adviser',
      specialty: 'Department of Surgery',
      institution: 'University of Uyo, Uyo',
      email: 'pekwere@hotmail.com'
    },
    {
      name: 'Prof. Memfin D. Ekpo',
      role: 'Editorial Adviser',
      specialty: 'Dept. of Pathology',
      institution: 'University of Uyo',
      email: 'memfinekpo@gmail.com'
    },
    {
      name: 'Prof. Etete Peters',
      role: 'Editorial Adviser',
      specialty: 'Dept. of Internal Medicine',
      institution: 'University of Uyo',
      email: 'etetepeters@yahoo.com'
    },
    {
      name: 'Prof. Victor A. Inem',
      role: 'Editorial Adviser',
      specialty: 'Dept. of Family Medicine',
      institution: 'University of Lagos',
      email: 'vinem@yahoo.com'
    },
    {
      name: 'Prof. Ekere Essien',
      role: 'Editorial Adviser',
      specialty: 'College of Pharmacy',
      institution: 'University of Houston, Houston, Texas, USA',
      email: 'ejessien@central.uh.edu'
    }
  ];

  const borderColors = [
    'var(--accent-color)',
    'var(--primary-color)',
    'var(--primary-dark)',
    'var(--text-muted)',
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

      <div style={{ marginTop: '24px' }}>
        <h3 className="section-title">Board Directory</h3>

        <div className="editorial-grid">
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
                fontSize: '11px',
                flexWrap: 'wrap'
              }}>
                <Mail size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                {member.email.split(',').map((email, eIdx) => {
                  const cleanEmail = email.trim();
                  return (
                    <React.Fragment key={eIdx}>
                      {eIdx > 0 && <span style={{ color: 'var(--text-muted)', margin: '0 2px' }}>|</span>}
                      <a href={`mailto:${cleanEmail}`} style={{ color: 'var(--text-muted)', wordBreak: 'break-all' }}>{cleanEmail}</a>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
