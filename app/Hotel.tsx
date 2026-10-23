"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { ArrowUpRight, ArrowRight, ArrowDown, CalendarDays, Users, Mountain, Menu, X, Coffee, Wifi, Check, ShieldCheck, BedDouble, Maximize, MapPin, Leaf, Sun, ChevronDown, LoaderCircle, CircleAlert, CheckCircle2, Download, Clock3, Heart, Bookmark, Plus, Minus } from "lucide-react";
import { ROOMS, todayISO, addDays, nights, validateSearch, money, dateLabel, type Room, type Search } from "../lib/rooms";

type Reservation = { id: string; code: string; roomType: string; checkIn: string; checkOut: string; guests: number; guestName: string; email: string; nightlyRate: number; total: number; status: "confirmed" | "cancelled"; createdAt: string };
type Available = Record<string, number>;
async function api<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(url, { ...options, signal: AbortSignal.timeout(20000) });
  const body = await response.json() as T & { error?: string };
  if (!response.ok) throw new Error(body.error || "Ocurrió un problema. Intenta de nuevo.");
  return body;
}
function ErrorMessage({ children }: { children: ReactNode }) {
  return <p className="error-message" role="alert"><CircleAlert size={18} />{children}</p>;
}
function Dialog({ title, children, onClose, wide = false, locked = false }: { title: string; children: ReactNode; onClose: () => void; wide?: boolean; locked?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { const el = ref.current; el?.showModal(); return () => { el?.close(); }; }, []);
  return <dialog ref={ref} className={`dialog ${wide ? "dialog-wide" : ""}`} aria-label={title}
    onCancel={e => { e.preventDefault(); if (!locked) onClose(); }}
    onClick={e => { if (e.target === e.currentTarget && !locked) onClose(); }}>
    <div className="dialog-shell"><button className="icon-button close-dialog" aria-label="Cerrar" onClick={onClose} disabled={locked}><X size={22} /></button>{children}</div>
  </dialog>;
}
function Brand({ light = false }: { light?: boolean }) {
  return <a className={`brand ${light ? "brand-light" : ""}`} href="#inicio" aria-label="Hotel Andes, inicio"><Mountain size={35} strokeWidth={1.35} /><span>HOTEL ANDES<small>UN REFUGIO EN LAS ALTURAS</small></span></a>;
}
function receipt(r: Reservation) {
  const room = ROOMS.find(x => x.id === r.roomType);
  const text = `HOTEL ANDES\nRESERVA DE DEMOSTRACIÓN\n\nCódigo: ${r.code}\nHuésped: ${r.guestName}\nHabitación: ${room?.name}\nLlegada: ${dateLabel(r.checkIn)}\nSalida: ${dateLabel(r.checkOut)}\nHuéspedes: ${r.guests}\nTotal: ${money(r.total)}\nEstado: ${r.status === "confirmed" ? "Confirmada" : "Cancelada"}\n\nPrototipo académico. No constituye una reserva en un hotel real. Sin cobros ni envío de correos.\n`;
  const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
  const a = document.createElement("a"); a.href = url; a.download = `Reserva-${r.code}.txt`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function Hotel() {
  const [filters, setFilters] = useState<Search>(() => ({ checkIn: addDays(todayISO(), 1), checkOut: addDays(todayISO(), 3), guests: 2 }));
  const [searched, setSearched] = useState<Search | null>(null);
  const [available, setAvailable] = useState<Available | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [category, setCategory] = useState("all");
  const [menu, setMenu] = useState(false);
  const [detail, setDetail] = useState<Room | null>(null);
  const [selected, setSelected] = useState<Room | null>(null);
  const [bookingDates, setBookingDates] = useState<Search>(filters);
  const [guestName, setGuestName] = useState("");
  const [email, setEmail] = useState("");
  const [requestKey, setRequestKey] = useState("");
  const [bookingBusy, setBookingBusy] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [confirmed, setConfirmed] = useState<Reservation | null>(null);
  const [showReservations, setShowReservations] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [reservationsLoading, setReservationsLoading] = useState(false);
  const [reservationsError, setReservationsError] = useState("");
  const [cancelTarget, setCancelTarget] = useState<string | null>(null);
  const [cancelBusy, setCancelBusy] = useState<string | null>(null);
  const [reservingId, setReservingId] = useState<string | null>(null);
  const today = todayISO();
  const activeCount = reservations.filter(r => r.status === "confirmed").length;

  useEffect(() => { loadReservations(); }, []);
  function changeFilters(patch: Partial<Search>) {
    setFilters(prev => ({ ...prev, ...patch })); setAvailable(null); setSearched(null); setSearchError("");
  }
  async function loadReservations() {
    setReservationsLoading(true); setReservationsError("");
    try { const data = await api<{ reservations: Reservation[] }>("/api/reservations"); setReservations(data.reservations); }
    catch (e) { setReservationsError(e instanceof Error ? e.message : "No pudimos cargar tus reservas."); }
    finally { setReservationsLoading(false); }
  }
  async function availabilityFor(s: Search) {
    const data = await api<{ rooms: { id: string; available: number }[] }>("/api/availability?" + new URLSearchParams({ checkIn: s.checkIn, checkOut: s.checkOut, guests: String(s.guests) }));
    return Object.fromEntries(data.rooms.map((r: { id: string; available: number }) => [r.id, r.available])) as Available;
  }
  async function search(e?: FormEvent) {
    e?.preventDefault(); const error = validateSearch(filters);
    if (error) { setSearchError(error); return; }
    setSearching(true); setSearchError("");
    try {
      const data = await availabilityFor(filters); setAvailable(data); setSearched({ ...filters }); setCategory("all");
      document.getElementById("habitaciones")?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (e) { setSearchError(e instanceof Error ? e.message : "No pudimos consultar las habitaciones."); }
    finally { setSearching(false); }
  }
  async function beginBooking(room: Room) {
    const error = validateSearch(filters);
    if (error) { setSearchError(error); document.getElementById("buscador")?.scrollIntoView({ behavior: "smooth", block: "center" }); return; }
    if (filters.guests > room.capacity) { setSearchError("Elige una habitación con capacidad para todos los huéspedes."); return; }
    setReservingId(room.id); setSearchError("");
    try {
      const data = await availabilityFor(filters); setAvailable(data); setSearched({ ...filters });
      if (!data[room.id]) { setDetail(null); setSearchError("Esta habitación no está disponible en esas fechas. Puedes elegir otra habitación o cambiar las fechas."); return; }
      setDetail(null); setSelected(room); setBookingDates({ ...filters }); setRequestKey(crypto.randomUUID()); setBookingError("");
    } catch (e) { setSearchError(e instanceof Error ? e.message : "No pudimos comprobar la disponibilidad."); }
    finally { setReservingId(null); }
  }
  async function confirmBooking(e: FormEvent) {
    e.preventDefault(); if (!selected || bookingBusy) return;
    setBookingBusy(true); setBookingError("");
    try {
      const data = await api<{ reservation: Reservation }>("/api/reservations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...bookingDates, roomType: selected.id, guestName, email, idempotencyKey: requestKey }) });
      setSelected(null); setConfirmed(data.reservation); await loadReservations();
      setAvailable(null); setSearched(null);
    } catch (e) { setBookingError(e instanceof Error ? e.message : "No pudimos confirmar tu reserva. Intenta de nuevo."); }
    finally { setBookingBusy(false); }
  }
  async function cancelReservation(id: string) {
    setCancelBusy(id); setReservationsError("");
    try {
      const data = await api<{ reservation: Reservation }>(`/api/reservations/${encodeURIComponent(id)}`, { method: "PATCH" });
      setReservations(prev => prev.map(r => r.id === id ? data.reservation : r)); setCancelTarget(null); setAvailable(null); setSearched(null);
    } catch (e) { setReservationsError(e instanceof Error ? e.message : "No pudimos cancelar la reserva."); }
    finally { setCancelBusy(null); }
  }
  const visibleRooms = ROOMS.filter(r => r.capacity >= filters.guests && (category === "all" || (category === "couple" ? r.capacity === 2 : r.capacity === 4)));
  const hasAvailability = available && Object.values(available).some(n => n > 0);
  return <>
    <a className="skip-link" href="#habitaciones">Ir a las habitaciones</a>
    <header className="header" id="inicio"><div className="header-inner">
      <Brand />
      <nav className={`navigation ${menu ? "navigation-open" : ""}`} aria-label="Navegación principal">
        <a href="#habitaciones" onClick={() => setMenu(false)}>Habitaciones</a><a href="#experiencia" onClick={() => setMenu(false)}>La experiencia</a><a href="#ubicacion" onClick={() => setMenu(false)}>Ubicación</a>
      </nav>
      <div className="header-actions"><button className="my-reservations" onClick={() => { setShowReservations(true); loadReservations(); }}><Bookmark size={17} /><span>Mis reservas</span>{activeCount > 0 && <b className="count">{activeCount}</b>}</button><a className="button button-small header-cta" href="#buscador">Reservar <ArrowUpRight size={16} /></a><button className="icon-button mobile-menu" onClick={() => setMenu(!menu)} aria-label={menu ? "Cerrar menú" : "Abrir menú"} aria-expanded={menu}>{menu ? <X /> : <Menu />}</button></div>
    </div></header>

    <main>
      <section className="hero" aria-labelledby="hero-title">
        <img src="/images/hero.webp" alt="Refugio de piedra y madera entre las montañas de los Andes al amanecer" className="hero-photo" fetchPriority="high" />
        <div className="hero-shade" />
        <div className="hero-content container"><p className="eyebrow hero-eyebrow"><span /> HOSPITALIDAD CON ALMA ANDINA</p><h1 id="hero-title">Hay lugares que<br />te hacen <em>respirar.</em></h1><p className="hero-description">Tu refugio entre montañas. Desconecta del ruido<br className="desktop-break" /> y encuentra el placer de estar aquí.</p><a className="hero-link" href="#habitaciones">Encuentra tu habitación <ArrowUpRight size={20} /></a><div className="hero-location"><MapPin size={16} /><span>Sorata, Bolivia</span><span className="hero-location-line" /><span>Más cerca de lo esencial</span></div></div>
        <a href="#buscador" className="hero-scroll" aria-label="Consultar disponibilidad"><ArrowDown size={21} /></a>
      </section>

      <section className="search-section container" id="buscador" aria-label="Buscar disponibilidad">
        <form className="search-form" onSubmit={search}>
          <label className="search-field"><span className="field-caption"><CalendarDays size={18} /> LLEGADA</span><input aria-label="Fecha de llegada" type="date" value={filters.checkIn} disabled={searching || reservingId !== null} min={today} max={addDays(today, 365)} onChange={e => changeFilters({ checkIn: e.target.value })} required /></label>
          <label className="search-field"><span className="field-caption"><CalendarDays size={18} /> SALIDA</span><input aria-label="Fecha de salida" type="date" value={filters.checkOut} disabled={searching || reservingId !== null} min={filters.checkIn ? addDays(filters.checkIn, 1) : today} onChange={e => changeFilters({ checkOut: e.target.value })} required /></label>
          <label className="search-field guests-field"><span className="field-caption"><Users size={18} /> HUÉSPEDES</span><select aria-label="Número de huéspedes" value={filters.guests} disabled={searching || reservingId !== null} onChange={e => changeFilters({ guests: Number(e.target.value) })}>{[1, 2, 3, 4].map(n => <option key={n} value={n}>{n} {n === 1 ? "huésped" : "huéspedes"}</option>)}</select></label>
          <button className="button search-button" type="submit" disabled={searching || reservingId !== null}>{searching ? <><LoaderCircle className="spin" size={18} />Buscando…</> : <>Ver disponibilidad <ArrowRight size={19} /></>}</button>
        </form>
        {searchError && <ErrorMessage>{searchError}</ErrorMessage>}
        <div className="booking-benefits"><span><Check size={15} />Reserva directa</span><span><ShieldCheck size={15} />Sin cobros en este prototipo</span><span><Coffee size={15} />Desayuno incluido</span></div>
      </section>

      <section className="rooms-section container" id="habitaciones" aria-labelledby="rooms-title">
        <div className="section-heading"><div><p className="eyebrow">ESPACIOS PARA QUEDARSE</p><h2 id="rooms-title">Descansa a tu manera.</h2><p>Detalles que abrazan. Vistas que se quedan contigo.</p></div><div className="room-filters" aria-label="Filtrar habitaciones">{[["all", "Todas"], ["couple", "Para dos"], ["family", "En familia"]].map(([key, label]) => <button key={key} className={category === key ? "active" : ""} aria-pressed={category === key} onClick={() => setCategory(key)}>{label}</button>)}</div></div>
        {searched && <div className="search-result" role="status"><CheckCircle2 size={18} /><span>{hasAvailability ? "Disponibilidad para" : "Sin disponibilidad para"} {dateLabel(searched.checkIn)} al {dateLabel(searched.checkOut)} · {nights(searched.checkIn, searched.checkOut)} noches · {searched.guests} {searched.guests === 1 ? "huésped" : "huéspedes"}</span><button onClick={() => document.getElementById("buscador")?.scrollIntoView({ behavior: "smooth", block: "center" })}>Cambiar fechas</button></div>}
        <div className="room-grid">
          {visibleRooms.map(room => <article className="room-card" key={room.id}>
            <button className="room-photo-button" onClick={() => setDetail(room)} aria-label={`Ver detalles de ${room.name}`}><img src={room.image} alt={room.name + ", interior de estilo andino contemporáneo"} loading="lazy" />{room.featured && <span className="room-tag"><Mountain size={13} /> Vista panorámica</span>}<span className="photo-open"><Plus size={20} /></span></button>
            <div className="room-body"><p className="room-category">{room.category}</p><h3><button onClick={() => setDetail(room)}>{room.name}</button></h3><div className="room-meta"><span><Users size={15} />Hasta {room.capacity}</span><span><Maximize size={14} />{room.size} m²</span><span><BedDouble size={16} />{room.capacity === 4 ? "3 camas" : room.id === "panoramica" ? "King" : "Queen"}</span></div><p className="room-description">{room.description}</p><div className="room-price-row"><div><span className="room-price">{money(room.rate)}</span><span className="price-period"> / noche</span><small>Desayuno e impuestos incluidos</small></div><button className="room-reserve" disabled={reservingId !== null || available?.[room.id] === 0} onClick={() => beginBooking(room)} aria-label={`Reservar ${room.name}`}>{reservingId === room.id ? <LoaderCircle className="spin" size={21} /> : <ArrowUpRight size={23} />}</button></div>{available && <p className={`availability ${available[room.id] ? "" : "unavailable"}`}>{available[room.id] ? <><span />{available[room.id]} {available[room.id] === 1 ? "habitación disponible" : "habitaciones disponibles"}</> : "Sin disponibilidad en estas fechas"}</p>}</div>
          </article>)}
        </div>
        {!visibleRooms.length && <div className="empty-filter"><Users size={30} /><h3>Un poco más de espacio para todos</h3><p>Para {filters.guests} huéspedes, te recomendamos el Refugio Familiar.</p><button className="button" onClick={() => setCategory("family")}>Ver habitación familiar <ArrowRight size={17} /></button></div>}
        <p className="rooms-note"><Leaf size={15} />Una estancia sencilla de reservar. Un lugar difícil de olvidar.</p>
      </section>

      <section className="experience-section" id="experiencia"><div className="container experience-grid"><div className="experience-copy"><p className="eyebrow">EL LUJO DE BAJAR EL RITMO</p><h2>La calma también<br /><em>es parte del viaje.</em></h2><p>Un café sin prisa, el aire de las montañas y una habitación que se siente como un abrazo. La experiencia Andes está en las cosas que importan.</p><a className="text-link" href="#buscador">Empieza a planear tu escapada <ArrowUpRight size={19} /></a></div><div className="experience-features"><div><Coffee /><h3>Mañanas con sabor local</h3><p>Desayuno incluido para empezar el día con calma.</p></div><div><Mountain /><h3>Naturaleza, de cerca</h3><p>Un paisaje andino que invita a salir y descubrir.</p></div><div><Heart /><h3>Hospitalidad que se siente</h3><p>Espacios cálidos, pensados para descansar.</p></div><div><Wifi /><h3>Conecta cuando quieras</h3><p>Wi-Fi en todas las habitaciones. El resto lo decides tú.</p></div></div></div></section>

      <section className="location-section container" id="ubicacion"><div className="location-image"><img src="/images/hero.webp" alt="Paisaje andino y arquitectura de montaña del concepto Hotel Andes" loading="lazy" /><span><MapPin size={15} /> VALLE DE SORATA, BOLIVIA</span></div><div className="location-copy"><p className="eyebrow">LEJOS DEL RUIDO, CERCA DE TI</p><h2>Tu próxima pausa<br />tiene un lugar.</h2><p>Imaginamos Hotel Andes en el valle de Sorata, rodeado de montañas y de la calidez de Bolivia. Un punto de partida para disfrutar a tu propio ritmo.</p><a className="text-link" href="https://www.google.com/maps/search/Sorata+Bolivia" target="_blank" rel="noreferrer">Explorar Sorata en el mapa <ArrowUpRight size={18} /></a><p className="location-note">Ubicación referencial para este proyecto académico.</p></div></section>

      <section className="faq-section container"><div><p className="eyebrow">ANTES DE TU ESCAPADA</p><h2>Todo un poco<br /> más claro.</h2></div><div className="faq-list">{[
        ["¿Cómo hago una reserva?", "Elige tus fechas y el número de huéspedes, consulta la disponibilidad y selecciona una habitación. Completa tu nombre y correo para obtener un código de confirmación. Este prototipo no realiza cobros ni envía correos."],
        ["¿Puedo consultar o cancelar mi reserva?", "Sí. En «Mis reservas» puedes ver el código, las fechas y el estado de tus estancias, descargar un comprobante y cancelar una reserva de demostración. La habitación vuelve a estar disponible al cancelarla."],
        ["¿Qué incluye la tarifa?", "Las tarifas de ejemplo incluyen el alojamiento, desayuno, Wi-Fi e impuestos. El total se calcula por habitación y por noche. Puedes ver el importe completo antes de confirmar."],
        ["¿Este hotel y las reservas son reales?", "Hotel Andes es un concepto desarrollado para una actividad académica. Las imágenes son ilustrativas y las reservas se guardan para demostrar el funcionamiento de la web. No constituyen una contratación real."],
      ].map(([q, a]) => <details key={q}><summary>{q}<ChevronDown size={19} /></summary><p>{a}</p></details>)}</div></section>
      <section className="closing-section"><Mountain size={29} strokeWidth={1.3} /><p>Algunas escapadas empiezan<br />con una buena decisión.</p><a className="button button-light" href="#buscador">Encuentra tu refugio <ArrowUpRight size={18} /></a></section>
    </main>
    <footer className="footer"><div className="container footer-top"><Brand light /><div><a href="#habitaciones">Habitaciones</a><a href="#experiencia">La experiencia</a><button onClick={() => { setShowReservations(true); loadReservations(); }}>Mis reservas</button></div><span>Hecho para sentir Bolivia.</span></div><div className="container footer-bottom"><p>Proyecto académico de Josue Padilla, Santiago Roca y Karen Caral.</p><p>Imágenes ilustrativas. Reservas de demostración, sin cobros.</p></div></footer>

    {detail && <Dialog title={`Detalles de ${detail.name}`} onClose={() => setDetail(null)} wide><div className="detail-grid"><img className="detail-photo" src={detail.image} alt={detail.name} /><div className="detail-content"><p className="eyebrow">TU ESPACIO EN LOS ANDES</p><h2>{detail.name}</h2><p>{detail.description}</p><div className="detail-specs"><span><Users size={18} />Hasta {detail.capacity} huéspedes</span><span><Maximize size={18} />{detail.size} m²</span><span><BedDouble size={18} />{detail.bed}</span></div><h3>Lo que te espera</h3><ul className="amenities">{detail.amenities.map(a => <li key={a}><Check size={16} />{a}</li>)}</ul><div className="detail-price"><strong>{money(detail.rate)}</strong><span> / noche, impuestos incluidos</span></div><button className="button full" disabled={reservingId !== null} onClick={() => beginBooking(detail)}>{reservingId ? <LoaderCircle size={18} className="spin" /> : <CalendarDays size={18} />}Consultar y reservar</button>{searchError && <ErrorMessage>{searchError}</ErrorMessage>}</div></div></Dialog>}

    {selected && <Dialog title="Completa tu reserva" onClose={() => { if (!bookingBusy) setSelected(null); }} wide locked={bookingBusy}><div className="booking-grid"><aside className="booking-summary"><img src={selected.image} alt={selected.name} /><div><p className="eyebrow">TU PRÓXIMA ESCAPADA</p><h3>{selected.name}</h3><div className="summary-dates"><div><small>LLEGADA</small><strong>{dateLabel(bookingDates.checkIn)}</strong></div><ArrowRight size={17} /><div><small>SALIDA</small><strong>{dateLabel(bookingDates.checkOut)}</strong></div></div><p className="summary-guests"><Users size={16} />{bookingDates.guests} huéspedes <span>·</span> {nights(bookingDates.checkIn, bookingDates.checkOut)} noches</p><div className="summary-line"><span>{money(selected.rate)} × {nights(bookingDates.checkIn, bookingDates.checkOut)} noches</span><span>{money(selected.rate * nights(bookingDates.checkIn, bookingDates.checkOut))}</span></div><div className="summary-line"><span>Impuestos y desayuno</span><span>Incluidos</span></div><div className="summary-total"><span>Total de la estancia</span><strong>{money(selected.rate * nights(bookingDates.checkIn, bookingDates.checkOut))}</strong></div></div></aside><form className="booking-form" onSubmit={confirmBooking}><p className="eyebrow">SOLO FALTA UN PASO</p><h2>Tu descanso,<br /> casi listo.</h2><p>Completa tus datos y guarda tu reserva.</p><label>Nombre completo<input name="guestName" autoComplete="name" placeholder="Ej. Josue Padilla" minLength={3} maxLength={80} required value={guestName} onChange={e => setGuestName(e.target.value)} disabled={bookingBusy} /></label><label>Correo electrónico<input type="email" name="email" autoComplete="email" placeholder="tucorreo@ejemplo.com" maxLength={254} required value={email} onChange={e => setEmail(e.target.value)} disabled={bookingBusy} /></label><p className="form-hint">El correo aparecerá en tu comprobante. No enviaremos mensajes.</p>{bookingError && <ErrorMessage>{bookingError}</ErrorMessage>}<button className="button full" type="submit" disabled={bookingBusy}>{bookingBusy ? <><LoaderCircle size={18} className="spin" />Confirmando…</> : <>Confirmar reserva <ArrowRight size={18} /></>}</button><p className="demo-note"><ShieldCheck size={17} />Reserva de demostración. No se realizará ningún cobro.</p></form></div></Dialog>}

    {confirmed && <Dialog title="Reserva confirmada" onClose={() => setConfirmed(null)}><div className="confirmation"><div className="success-icon"><Check size={31} /></div><p className="eyebrow">YA TIENES TU REFUGIO</p><h2>Tu reserva está lista.</h2><p>Gracias, {confirmed.guestName.split(" ")[0]}. Guarda tu código para consultar esta estancia.</p><div className="confirmation-code"><small>CÓDIGO DE RESERVA</small><strong>{confirmed.code}</strong></div><div className="confirmation-details"><strong>{ROOMS.find(r => r.id === confirmed.roomType)?.name}</strong><p>{dateLabel(confirmed.checkIn)} al {dateLabel(confirmed.checkOut)}</p><p>{confirmed.guests} huéspedes · {nights(confirmed.checkIn, confirmed.checkOut)} noches</p><span>Total <b>{money(confirmed.total)}</b></span></div><button className="button full" onClick={() => receipt(confirmed)}><Download size={18} />Descargar comprobante</button><button className="secondary-button full" onClick={() => { setConfirmed(null); setShowReservations(true); }}>Ver mis reservas <ArrowRight size={17} /></button><p className="demo-note centered">Confirmación de demostración, sin cobros ni envío de correos.</p></div></Dialog>}

    {showReservations && <Dialog title="Mis reservas" onClose={() => { if (!cancelBusy) setShowReservations(false); }} wide locked={!!cancelBusy}><div className="reservations-panel"><p className="eyebrow">TUS PRÓXIMAS PAUSAS</p><h2>Mis reservas</h2><p>Los detalles de tu estancia, siempre a mano.</p>{reservationsError && <><ErrorMessage>{reservationsError}</ErrorMessage><button className="text-link" onClick={loadReservations}>Volver a cargar <ArrowRight size={17} /></button></>}{reservationsLoading ? <div className="empty-reservations"><LoaderCircle className="spin" size={28} /><p>Cargando tus reservas…</p></div> : !reservations.length && !reservationsError ? <div className="empty-reservations"><CalendarDays size={44} strokeWidth={1.2} /><h3>Tu próxima escapada empieza aquí.</h3><p>Aún no tienes reservas. Encuentra la habitación que va contigo.</p><button className="button" onClick={() => { setShowReservations(false); document.getElementById("habitaciones")?.scrollIntoView({ behavior: "smooth" }); }}>Explorar habitaciones <ArrowRight size={18} /></button></div> : <div className="reservation-list">{reservations.map(r => { const room = ROOMS.find(x => x.id === r.roomType); return <article className={`reservation-item ${r.status === "cancelled" ? "cancelled" : ""}`} key={r.id}><div className="reservation-main"><img src={room?.image} alt={room?.name || "Habitación"} /><div><span className={`status-label ${r.status}`}>{r.status === "confirmed" ? "Confirmada" : "Cancelada"}</span><h3>{room?.name}</h3><p>{dateLabel(r.checkIn)} al {dateLabel(r.checkOut)}</p><small>{r.guests} huéspedes · {r.code}</small></div><strong>{money(r.total)}</strong></div><div className="reservation-actions"><button onClick={() => receipt(r)}><Download size={15} />Comprobante</button>{r.status === "confirmed" && cancelTarget !== r.id && <button className="cancel-link" onClick={() => setCancelTarget(r.id)}>Cancelar reserva</button>}</div>{cancelTarget === r.id && <div className="cancel-confirm"><p>¿Quieres cancelar esta reserva? La habitación volverá a estar disponible.</p><div><button className="secondary-button" disabled={!!cancelBusy} onClick={() => setCancelTarget(null)}>Mantener reserva</button><button className="danger-button" disabled={!!cancelBusy} onClick={() => cancelReservation(r.id)}>{cancelBusy ? <LoaderCircle className="spin" size={16} /> : null}Sí, cancelar</button></div></div>}</article>; })}</div>}<p className="reservations-note">Solo puedes consultar tus propias reservas. Las reservas de demostración no generan cobros.</p></div></Dialog>}
  </>;
}


