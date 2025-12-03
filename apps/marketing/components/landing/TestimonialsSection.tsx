'use client';

const testimonials = [
  {
    quote:
      'Timagatt completely transformed how we manage our design sprints. It’s intuitive, fast, and beautiful.',
    name: 'Sarah Jenkins',
    role: 'Product Manager, TechFlow',
    avatar: 'https://i.pravatar.cc/100?img=33',
  },
  {
    quote:
      "Finally a tool that doesn't feel like a spreadsheet. The analytics features alone are worth the price.",
    name: 'Mark Davis',
    role: 'CTO, StartUp Inc',
    avatar: 'https://i.pravatar.cc/100?img=11',
  },
  {
    quote: "I can't imagine running my team without Timagatt anymore. It's become the brain of our operation.",
    name: 'Emily Chen',
    role: 'Director, CreativeLabs',
    avatar: 'https://i.pravatar.cc/100?img=24',
  },
] as const;

export function TestimonialsSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <h2 className="mb-16 text-center text-3xl font-bold tracking-tight text-slate-900">
        Loved by teams globally
      </h2>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {testimonials.map((testimonial) => (
          <article
            key={testimonial.name}
            className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm"
          >
            <div className="mb-4 flex gap-1 text-amber-400">
              {Array.from({ length: 5 }).map((_, index) => (
                <svg key={index} className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="mb-6 font-medium text-slate-600">"{testimonial.quote}"</p>
            <div className="flex items-center gap-3">
              <img src={testimonial.avatar} alt={testimonial.name} className="h-10 w-10 rounded-full" />
              <div>
                <div className="text-sm font-bold text-slate-900">{testimonial.name}</div>
                <div className="text-xs text-slate-500">{testimonial.role}</div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

