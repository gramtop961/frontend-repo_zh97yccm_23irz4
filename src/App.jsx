import { useEffect, useMemo, useState } from 'react';
import Spline from '@splinetool/react-spline';
import { CalendarDays, Loader2, Megaphone, Plus, Send, Sparkles, Tag, User } from 'lucide-react';

const API_BASE = import.meta.env.VITE_BACKEND_URL;

function App() {
  const [tab, setTab] = useState('updates');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');

  const [postForm, setPostForm] = useState({ author: '', title: '', content: '', tag: '' });
  const [eventForm, setEventForm] = useState({ name: '', description: '', date: '', time: '', venue: '', organizer: '' });

  const base = useMemo(() => (API_BASE ? API_BASE.replace(/\/$/, '') : ''), []);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        const [pRes, eRes] = await Promise.all([
          fetch(`${base}/api/posts`),
          fetch(`${base}/api/events`),
        ]);
        if (!pRes.ok || !eRes.ok) throw new Error('Failed to load data');
        const [p, e] = await Promise.all([pRes.json(), eRes.json()]);
        setPosts(p);
        setEvents(e);
      } catch (e) {
        setError('Could not load data. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [base]);

  async function submitPost(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(`${base}/api/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postForm),
      });
      if (!res.ok) throw new Error('Failed to submit');
      // reload
      const list = await fetch(`${base}/api/posts`).then(r => r.json());
      setPosts(list);
      setPostForm({ author: '', title: '', content: '', tag: '' });
      setTab('updates');
    } catch (err) {
      setError('Could not post update.');
    } finally {
      setSubmitting(false);
    }
  }

  async function submitEvent(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(`${base}/api/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventForm),
      });
      if (!res.ok) throw new Error('Failed to submit');
      // reload
      const list = await fetch(`${base}/api/events`).then(r => r.json());
      setEvents(list);
      setEventForm({ name: '', description: '', date: '', time: '', venue: '', organizer: '' });
      setTab('events');
    } catch (err) {
      setError('Could not create event.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-rose-50 via-white to-white text-gray-900">
      {/* Top nav */}
      <header className="fixed top-0 left-0 right-0 z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mt-4 flex h-14 items-center justify-between rounded-2xl border border-white/20 bg-white/70 px-4 backdrop-blur-md shadow-sm">
            <a href="#" className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-md bg-gradient-to-br from-rose-500 to-red-600"></div>
              <span className="text-sm font-semibold tracking-tight">Campus Pulse</span>
            </a>
            <div className="hidden md:flex items-center gap-6 text-sm">
              <a href="#updates" className="hover:text-gray-900">Updates</a>
              <a href="#events" className="hover:text-gray-900">Events</a>
              <a href="#post" className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-4 py-2 text-white font-semibold shadow hover:bg-red-500"><Plus size={16}/> New</a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero with 3D scene */}
      <section className="relative isolate pt-24 sm:pt-28">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Text */}
            <div className="relative z-10 order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-rose-700 text-xs font-medium">
                <Sparkles size={14} /> Daily updates · Events · Announcements
              </div>
              <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
                Your college feed in an
                <span className="bg-gradient-to-r from-rose-600 to-red-600 bg-clip-text text-transparent"> interactive 3D space</span>
              </h1>
              <p className="mt-4 max-w-xl text-base sm:text-lg text-gray-600">
                Share news, plan events, and keep everyone synced with a clean, modern interface and a tactile 3D globe.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="#post" className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-white font-semibold shadow hover:bg-red-500">
                  <Plus size={18}/> Create a post
                </a>
                <a href="#events" className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-gray-900 font-semibold shadow-sm hover:border-gray-300">
                  <CalendarDays size={18}/> See events
                </a>
              </div>
            </div>

            {/* 3D canvas */}
            <div className="relative order-1 lg:order-2 h-[60vh] sm:h-[65vh] md:h-[70vh] lg:h-[75vh] w-full rounded-3xl overflow-hidden border border-white/20 shadow-xl">
              <Spline scene="https://prod.spline.design/M2rj0DQ6tP7dSzSz/scene.splinecode" style={{ width: '100%', height: '100%' }} />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-rose-100/30" />
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute -z-0 inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-[-10%] h-72 w-72 -translate-x-1/2 rounded-full bg-rose-200/40 blur-3xl" />
          <div className="absolute right-[10%] bottom-[5%] h-80 w-80 rounded-full bg-red-100/50 blur-3xl" />
        </div>
      </section>

      {/* Controls */}
      <section id="post" className="relative pt-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur p-4 sm:p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <button onClick={() => setTab('updates')} className={`rounded-xl px-3 py-2 text-sm font-semibold ${tab==='updates'?'bg-rose-600 text-white':'text-gray-700 hover:bg-gray-100'}`}>Updates</button>
              <button onClick={() => setTab('events')} className={`rounded-xl px-3 py-2 text-sm font-semibold ${tab==='events'?'bg-rose-600 text-white':'text-gray-700 hover:bg-gray-100'}`}>Events</button>
            </div>

            {/* Forms */}
            <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 order-2 lg:order-1">
                {loading ? (
                  <div className="flex items-center gap-2 text-gray-600"><Loader2 className="animate-spin" size={18}/> Loading...</div>
                ) : (
                  <Feed posts={posts} events={events} mode={tab} />
                )}
                {error && <div className="mt-4 rounded-lg bg-red-50 text-red-700 px-3 py-2 text-sm">{error}</div>}
              </div>

              <div className="order-1 lg:order-2">
                {tab === 'updates' ? (
                  <form onSubmit={submitPost} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                    <h3 className="text-base font-bold flex items-center gap-2"><Megaphone size={18}/> Share an update</h3>
                    <div className="mt-3 grid grid-cols-1 gap-3">
                      <Input icon={<User size={16}/>} placeholder="Your name" value={postForm.author} onChange={(v)=>setPostForm(s=>({...s, author:v}))} required />
                      <Input icon={<Tag size={16}/>} placeholder="Title" value={postForm.title} onChange={(v)=>setPostForm(s=>({...s, title:v}))} required />
                      <textarea value={postForm.content} onChange={(e)=>setPostForm(s=>({...s, content:e.target.value}))} placeholder="What's new?" className="min-h-[96px] w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" required />
                      <Input icon={<Tag size={16}/>} placeholder="Tag (optional)" value={postForm.tag} onChange={(v)=>setPostForm(s=>({...s, tag:v}))} />
                    </div>
                    <button disabled={submitting} className="mt-3 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white text-sm font-semibold hover:bg-red-500 disabled:opacity-60">
                      {submitting ? <Loader2 className="animate-spin" size={16}/> : <Send size={16}/>} Post update
                    </button>
                  </form>
                ) : (
                  <form onSubmit={submitEvent} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                    <h3 className="text-base font-bold flex items-center gap-2"><CalendarDays size={18}/> Create an event</h3>
                    <div className="mt-3 grid grid-cols-1 gap-3">
                      <Input placeholder="Event name" value={eventForm.name} onChange={(v)=>setEventForm(s=>({...s, name:v}))} required />
                      <textarea value={eventForm.description} onChange={(e)=>setEventForm(s=>({...s, description:e.target.value}))} placeholder="Description" className="min-h-[72px] w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" required />
                      <div className="grid grid-cols-2 gap-3">
                        <Input type="date" value={eventForm.date} onChange={(v)=>setEventForm(s=>({...s, date:v}))} required />
                        <Input type="time" value={eventForm.time} onChange={(v)=>setEventForm(s=>({...s, time:v}))} />
                      </div>
                      <Input placeholder="Venue" value={eventForm.venue} onChange={(v)=>setEventForm(s=>({...s, venue:v}))} />
                      <Input placeholder="Organizer" value={eventForm.organizer} onChange={(v)=>setEventForm(s=>({...s, organizer:v}))} />
                    </div>
                    <button disabled={submitting} className="mt-3 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white text-sm font-semibold hover:bg-red-500 disabled:opacity-60">
                      {submitting ? <Loader2 className="animate-spin" size={16}/> : <Send size={16}/>} Create event
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lists */}
      <section id="updates" className="relative py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Latest updates</h2>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.length === 0 ? (
              <div className="col-span-full rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">No updates yet. Be the first to post!</div>
            ) : (
              posts.map(p => <PostCard key={p.id} post={p} />)
            )}
          </div>
        </div>
      </section>

      <section id="events" className="relative pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Upcoming events</h2>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.length === 0 ? (
              <div className="col-span-full rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">No events yet. Create one on the right.</div>
            ) : (
              events.map(ev => <EventCard key={ev.id} event={ev} />)
            )}
          </div>
        </div>
      </section>

      <footer className="border-t bg-white/60 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} Campus Pulse — All rights reserved.</p>
          <div className="flex items-center gap-4 text-sm">
            <a className="text-gray-600 hover:text-gray-900" href="#">Privacy</a>
            <a className="text-gray-600 hover:text-gray-900" href="#">Terms</a>
            <a className="text-gray-600 hover:text-gray-900" href="#">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Input({ icon, value, onChange, type='text', placeholder='', required=false }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2">
      {icon && <div className="text-gray-500">{icon}</div>}
      <input type={type} required={required} value={value} onChange={(e)=>onChange(e.target.value)} placeholder={placeholder} className="w-full text-sm focus:outline-none" />
    </div>
  );
}

function Feed({ posts, events, mode }) {
  if (mode === 'events') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {events.slice(0,4).map(ev => <EventCard key={ev.id} event={ev} />)}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {posts.slice(0,4).map(p => <PostCard key={p.id} post={p} />)}
    </div>
  );
}

function PostCard({ post }) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-transform hover:-translate-y-0.5">
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      <div className="text-xs text-rose-700 font-semibold">{post.tag || 'Update'}</div>
      <h3 className="mt-1 text-lg font-bold">{post.title}</h3>
      <p className="mt-2 text-sm text-gray-600 line-clamp-4">{post.content}</p>
      <div className="mt-4 text-xs text-gray-500">by {post.author}</div>
    </article>
  );
}

function EventCard({ event }) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-transform hover:-translate-y-0.5">
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      <div className="text-xs text-rose-700 font-semibold">Event</div>
      <h3 className="mt-1 text-lg font-bold">{event.name}</h3>
      <p className="mt-2 text-sm text-gray-600 line-clamp-4">{event.description}</p>
      <div className="mt-4 text-xs text-gray-500 flex items-center gap-3">
        {event.date && <span>{event.date}{event.time ? ` • ${event.time}`:''}</span>}
        {event.venue && <span>• {event.venue}</span>}
      </div>
      {event.organizer && <div className="mt-1 text-xs text-gray-500">by {event.organizer}</div>}
    </article>
  );
}

export default App;
