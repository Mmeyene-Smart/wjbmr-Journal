import React from 'react';
import { Mail, ShieldCheck, Award, BookOpen, Users, MapPin } from 'lucide-react';

export default function EditorialBoard() {
  const EDITORIAL_MEMBERS = [
    {
      name: 'Dr. Emmanuel Olu Megbelayin',
      role: 'Editor-In-Chief',
      specialty: 'Department of Ophthalmology',
      institution: 'University of Uyo, Uyo',
      email: 'favouredolu@yahoo.com'
    },
    {
      name: 'Dr. Timothy Ekwere',
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
      name: 'Dr. Timothy Nottidge',
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
              <Mail size={18} /> Correspondences
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-dark)', lineHeight: '1.5', marginBottom: '8px' }}>
              All correspondence should be forwarded to the:
            </p>
            <strong style={{ display: 'block', fontSize: '13px', color: 'var(--primary-dark)' }}>Editor-in-Chief</strong>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', lineHeight: '1.4' }}>
              Department of Ophthalmology<br />
              University of Uyo Teaching Hospital, Uyo / University of Uyo, Uyo<br />
              Akwa Ibom State, Nigeria
            </p>
            <a href="mailto:favouredolu@yahoo.com" style={{ fontSize: '13px', color: 'var(--primary-color)', fontWeight: 'bold', marginTop: '8px', display: 'block' }}>
              favouredolu@yahoo.com
            </a>
          </div>
        </div>


      </div>
    </div>
  );
}
