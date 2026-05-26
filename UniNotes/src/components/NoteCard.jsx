const subjectColors = {
  'Computer Science (CSE)': { bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.25)', text: '#818cf8' },
  'Information Tech (IT)': { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.25)', text: '#34d399' },
  'Mechanical Engg. (ME)': { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)', text: '#fbbf24' },
  'Electronics (ECE)': { bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.25)', text: '#60a5fa' },
  'Civil Engg. (CE)': { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.25)', text: '#f87171' },
  'Electrical (EE)': { bg: 'rgba(234,179,8,0.1)', border: 'rgba(234,179,8,0.25)', text: '#facc15' },
  'Common': { bg: 'rgba(168,85,247,0.1)', border: 'rgba(168,85,247,0.25)', text: '#c084fc' },
};

const getSubjectStyle = (subject) => {
  for (const [key, val] of Object.entries(subjectColors)) {
    if (subject && subject.includes(key.split(' ')[0])) return val;
  }
  return { bg: 'rgba(233,94,134,0.1)', border: 'rgba(233,94,134,0.25)', text: '#f472b6' };
};

function NoteCard({ note, onPreview, onDownload, onLike, isLiked }) {
  const style = getSubjectStyle(note.subject);
  const author = note.user || {};
  const authorName = author.name || 'Unknown';
  const authorEmail = author.email || '';
  const authorLinkedin = author.linkedin || '';
  const authorInitials = authorName.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div
      className="card"
      style={{
        padding: '1.35rem',
        borderRadius: '14px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
      onClick={onPreview}
    >
      {/* Like Button */}
      {onLike && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onLike(note, e);
          }}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            width: '30px',
            height: '30px',
            borderRadius: '8px',
            background: isLiked ? 'var(--primary-subtle)' : 'rgba(28, 20, 16, 0.04)',
            border: `1px solid ${isLiked ? 'rgba(193, 68, 14, 0.25)' : 'rgba(28, 20, 16, 0.08)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isLiked ? 'var(--primary)' : 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: '0.8rem',
            transition: 'all 0.15s',
            zIndex: 10,
            outline: 'none',
          }}
          title={isLiked ? "Unlike" : "Like"}
        >
          {isLiked ? '❤️' : '♡'}
        </button>
      )}

      {/* Header */}
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginBottom: '0.75rem', paddingRight: onLike ? '2rem' : '0' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{
            margin: 0, fontSize: '0.95rem', fontWeight: 600, color: 'var(--text)',
            lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden'
          }}>
            {note.title}
          </h3>
          {note.courseCode && (
            <span style={{
              display: 'inline-block', marginTop: '0.25rem',
              fontSize: '0.68rem', fontWeight: 600, color: style.text,
              background: style.bg, border: `1px solid ${style.border}`,
              padding: '1px 7px', borderRadius: '6px'
            }}>
              {note.courseCode}
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      {(note.description || note.content) && (
        <p style={{
          margin: '0 0 0.75rem 0', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          flex: 1
        }}>
          {note.description || note.content}
        </p>
      )}

      <div style={{ marginTop: 'auto' }}>
        {/* Meta */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: style.text, opacity: 0.6 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{note.subject}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#6b7280', opacity: 0.4 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{note.university}</span>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.3rem', fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            <span>{note.downloads || 0} views</span>
            <span>{note.likes ? note.likes.length : 0} likes</span>
          </div>
        </div>

        {/* Author — simplified */}
        <div style={{
          background: 'rgba(28, 20, 16, 0.03)',
          border: '1px solid rgba(28, 20, 16, 0.05)',
          borderRadius: '10px',
          padding: '0.6rem',
          marginBottom: '0.6rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '7px', flexShrink: 0,
              background: 'var(--primary)',
              display: 'flex', alignItems: 'center', justifycontent: 'center',
              fontSize: '0.65rem', fontWeight: 700, color: 'white',
            }}>
              {authorInitials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: '0.78rem', fontWeight: 600, color: 'var(--text)',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {authorName}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.25rem', flexShrink: 0 }}>
              {authorEmail && (
                <a
                  href={`mailto:${authorEmail}?subject=Re: ${encodeURIComponent(note.title)}`}
                  onClick={(e) => e.stopPropagation()}
                  title={`Email ${authorName}`}
                  style={{
                    width: '26px', height: '26px', borderRadius: '6px',
                    background: 'rgba(28,20,16,0.03)', border: '1px solid rgba(28,20,16,0.05)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.15s',
                  }}
                  onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary)'}
                  onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                  title="LinkedIn"
                  style={{
                    width: '26px', height: '26px', borderRadius: '6px',
                    background: 'rgba(28,20,16,0.03)', border: '1px solid rgba(28,20,16,0.05)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.15s',
                  }}
                  onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary)'}
                  onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button
            onClick={(e) => { e.stopPropagation(); onPreview && onPreview(); }}
            style={{
              flex: 1, padding: '0.45rem', background: 'rgba(28,20,16,0.03)', border: '1px solid rgba(28,20,16,0.05)',
              color: 'var(--text-muted)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600,
              fontSize: '0.78rem', transition: 'all 0.15s', fontFamily: 'inherit',
            }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--text)'; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(28,20,16,0.05)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
          >
            Preview
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDownload && onDownload(e); }}
            style={{
              flex: 1, padding: '0.45rem', background: 'var(--primary-subtle)', border: '1px solid rgba(193, 68, 14, 0.15)',
              color: 'var(--primary)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600,
              fontSize: '0.78rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem',
              transition: 'all 0.15s', fontFamily: 'inherit',
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(193, 68, 14, 0.12)'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'var(--primary-subtle)'; }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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