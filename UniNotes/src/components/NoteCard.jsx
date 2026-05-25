const subjectColors = {
  'Computer Science (CSE)': { bg: 'rgba(99,102,241,0.15)', border: 'rgba(99,102,241,0.4)', text: '#818cf8', icon: '💻' },
  'Information Tech (IT)': { bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.4)', text: '#34d399', icon: '🌐' },
  'Mechanical Engg. (ME)': { bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.4)', text: '#fbbf24', icon: '⚙️' },
  'Electronics (ECE)': { bg: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.4)', text: '#60a5fa', icon: '📡' },
  'Civil Engg. (CE)': { bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.4)', text: '#f87171', icon: '🏗️' },
  'Electrical (EE)': { bg: 'rgba(234,179,8,0.15)', border: 'rgba(234,179,8,0.4)', text: '#facc15', icon: '⚡' },
  'Common': { bg: 'rgba(168,85,247,0.15)', border: 'rgba(168,85,247,0.4)', text: '#c084fc', icon: '📖' },
};

const getSubjectStyle = (subject) => {
  for (const [key, val] of Object.entries(subjectColors)) {
    if (subject && subject.includes(key.split(' ')[0])) return val;
  }
  return { bg: 'rgba(233,94,134,0.15)', border: 'rgba(233,94,134,0.4)', text: '#f472b6', icon: '📝' };
};

function NoteCard({ note, onPreview, onDownload, onLike, isLiked }) {
  const style = getSubjectStyle(note.subject);
  const author = note.user || {};
  const authorName = author.name || 'Unknown Author';
  const authorEmail = author.email || '';
  const authorLinkedin = author.linkedin || '';
  const authorInitials = authorName.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div
      className="glass-panel"
      style={{
        padding: '1.5rem',
        borderRadius: '16px',
        transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.25s, border-color 0.25s',
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderLeft: `3px solid ${style.border}`,
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.boxShadow = `0 20px 40px -10px rgba(0,0,0,0.5), 0 0 0 1px ${style.border}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
      onClick={onPreview}
    >
      {/* Floating Like Heart Button */}
      {onLike && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onLike(note, e);
          }}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: isLiked ? 'rgba(233, 94, 134, 0.15)' : 'rgba(255, 255, 255, 0.05)',
            border: `1px solid ${isLiked ? 'rgba(233, 94, 134, 0.4)' : 'rgba(255, 255, 255, 0.08)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isLiked ? '#e95e86' : '#a1a1aa',
            cursor: 'pointer',
            fontSize: '0.85rem',
            transition: 'all 0.2s',
            zIndex: 10,
            outline: 'none',
            boxShadow: isLiked ? '0 0 10px rgba(233, 94, 134, 0.2)' : 'none'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
          title={isLiked ? "Unlike note" : "Like note"}
        >
          {isLiked ? '❤️' : '🤍'}
        </button>
      )}

      {/* Top accent glow */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
        background: `linear-gradient(90deg, ${style.border}, transparent)`,
      }} />

      {/* Header row */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1rem', paddingRight: onLike ? '2rem' : '0' }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: '12px', flexShrink: 0,
          background: style.bg, border: `1px solid ${style.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.4rem'
        }}>
          {style.icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{
            margin: 0, fontSize: '1rem', fontWeight: 700, color: '#f1f5f9',
            lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden'
          }}>
            {note.title}
          </h3>
          <span style={{
            display: 'inline-block', marginTop: '0.3rem',
            fontSize: '0.7rem', fontWeight: 600, color: style.text,
            background: style.bg, border: `1px solid ${style.border}`,
            padding: '1px 8px', borderRadius: '999px'
          }}>
            {note.courseCode || 'N/A'}
          </span>
        </div>
      </div>

      {/* Description */}
      {(note.description || note.content) && (
        <p style={{
          margin: '0 0 1rem 0', fontSize: '0.82rem', color: '#94a3b8', lineHeight: '1.5',
          display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          flex: 1
        }}>
          {note.description || note.content}
        </p>
      )}

      <div style={{ marginTop: 'auto' }}>
        {/* Meta */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#64748b' }}>
            <span>📚</span>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{note.subject}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#64748b' }}>
            <span>🏛️</span>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{note.university}</span>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.4rem', fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }} title="Views / Downloads">
              📥 {note.downloads || 0} views
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }} title="Likes">
              ❤️ {note.likes ? note.likes.length : 0} likes
            </span>
          </div>
        </div>

        {/* Meet the Author */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '12px',
          padding: '0.75rem',
          marginBottom: '0.75rem',
        }}>
          <div style={{
            fontSize: '0.65rem', fontWeight: 700, color: '#475569',
            textTransform: 'uppercase', letterSpacing: '0.08em',
            marginBottom: '0.5rem',
          }}>
            Meet the Author
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {/* Avatar */}
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, #6366f1, #e95e86)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.7rem', fontWeight: 700, color: 'white',
            }}>
              {authorInitials}
            </div>
            {/* Name + Contact */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: '0.82rem', fontWeight: 600, color: '#e2e8f0',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {authorName}
              </div>
            </div>
            {/* Contact Buttons */}
            <div style={{ display: 'flex', gap: '0.35rem', flexShrink: 0 }}>
              {authorEmail && (
                <a
                  href={`mailto:${authorEmail}?subject=Regarding your note: ${encodeURIComponent(note.title)}`}
                  onClick={(e) => e.stopPropagation()}
                  title={`Email ${authorName}`}
                  style={{
                    width: '30px', height: '30px', borderRadius: '8px',
                    background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#f87171', textDecoration: 'none',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(239,68,68,0.25)';
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(239,68,68,0.12)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </a>
              )}
              {authorLinkedin && (
                <a
                  href={authorLinkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  title={`${authorName}'s LinkedIn`}
                  style={{
                    width: '30px', height: '30px', borderRadius: '8px',
                    background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#60a5fa', textDecoration: 'none',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(59,130,246,0.25)';
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(59,130,246,0.12)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              )}
              {!authorEmail && !authorLinkedin && (
                <span style={{ fontSize: '0.7rem', color: '#475569', fontStyle: 'italic' }}>
                  No contact info
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={(e) => { e.stopPropagation(); onPreview && onPreview(); }}
            style={{
              flex: 1, padding: '0.5rem', background: style.bg, border: `1px solid ${style.border}`,
              color: style.text, borderRadius: '8px', cursor: 'pointer', fontWeight: 600,
              fontSize: '0.8rem', transition: 'opacity 0.2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
            onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
          >
            Preview
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDownload && onDownload(e); }}
            style={{
              flex: 1, padding: '0.5rem', background: 'rgba(233,94,134,0.15)', border: '1px solid rgba(233,94,134,0.4)',
              color: '#e95e86', borderRadius: '8px', cursor: 'pointer', fontWeight: 600,
              fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem',
              transition: 'opacity 0.2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
            onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download
          </button>
        </div>
      </div>
    </div>
  );
}

export default NoteCard;