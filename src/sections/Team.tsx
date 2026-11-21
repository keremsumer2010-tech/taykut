import { Emblem } from '@/components/Emblem';
import { SectionHeader } from '@/components/SectionHeader';
import { ADVISOR, MEMBERS } from '@/content/team';
import { useT } from '@/lib/i18n';
import s from './sections.module.css';

export function Team() {
  const t = useT();
  const sec = t.team;
  return (
    <section id="team" className="section" aria-labelledby="team-title">
      <div className="container">
        <SectionHeader
          id="team-title"
          index={sec.index}
          kicker={sec.kicker}
          title={sec.title}
          lead={sec.lead}
        />
        <ul className={s.team}>
          {MEMBERS.map((m, i) => (
            <li key={m.name} className={`${s.member} ${m.role === 'captain' ? s.memberLead : ''}`}>
              <span className={s.emblem}>
                <Emblem name={m.emblem} />
              </span>
              <span className={`t-label ${s.memberIndex}`}>{String(i + 1).padStart(2, '0')}</span>
              <h3 className={s.memberName}>{m.name}</h3>
              <p className="t-label">{m.role === 'captain' ? sec.captain : sec.member}</p>
            </li>
          ))}
          <li className={`${s.member} ${s.memberAdvisor}`}>
            <span className={s.emblem}>
              <Emblem name={ADVISOR.emblem} />
            </span>
            <span className={`t-label ${s.memberIndex}`}>—</span>
            <h3 className={s.memberName}>{ADVISOR.name}</h3>
            <p className="t-label">{sec.advisor}</p>
          </li>
        </ul>
      </div>
    </section>
  );
}
