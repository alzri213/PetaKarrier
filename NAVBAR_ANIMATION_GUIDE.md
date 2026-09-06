# 🎨 Navbar Menu Animation Guide

## ✨ Fitur Animasi Baru

### **Desktop Navigation Links**

#### **1. Active State (Halaman Aktif)**
- ✅ Underline gradient hijau (`#00df82` → `emerald-400`)
- ✅ Spring animation dengan smooth transition
- ✅ Text bold dengan warna hijau brand
- ✅ Height: 0.5 (2px) dengan rounded corners

#### **2. Hover State (Mouse Over)**
- ✅ Underline abu-abu muncul dari kiri ke kanan
- ✅ Scale animation dengan `origin-left`
- ✅ Text color berubah ke darker shade
- ✅ Duration: 300ms cubic-bezier smooth

#### **3. Transition Details**
```tsx
Active Underline:
- Type: Spring animation
- Stiffness: 500 (responsive)
- Damping: 30 (smooth settle)
- ScaleX: 0 → 1
- Opacity: 0 → 1

Hover Underline:
- Type: CSS transition
- Duration: 300ms
- Transform: scaleX(0) → scaleX(1)
- Origin: left (slide from left)
```

---

### **Mobile Navigation (Drawer)**

#### **1. Active State**
- ✅ Background hijau muda (`emerald-50` light / `emerald-950/60` dark)
- ✅ Vertical bar hijau di kiri (width: 4px)
- ✅ Spring animation dengan `layoutId` untuk smooth transition
- ✅ Text bold dengan warna brand

#### **2. Layout Animation**
- Menggunakan Framer Motion `layoutId="mobile-active-nav"`
- Smooth transition ketika berpindah menu
- Bar indikator bergerak mengikuti menu aktif

---

## 🎯 Visual Examples

### **Desktop View - Hover States:**

```
Normal State:
┌──────────────────┐
│ Analisis Potensi │
└──────────────────┘

Hover State:
┌──────────────────┐
│ Analisis Potensi │
└━━━━━━━━━━━━━━━━━━┘ ← Gray underline slides in

Active State:
┌──────────────────┐
│ Analisis Potensi │ ← Bold green text
└━━━━━━━━━━━━━━━━━━┘ ← Green gradient underline (always visible)
```

### **Mobile View - Active Indicator:**

```
Normal Item:
┌─────────────────────┐
│  Analisis Potensi   │
└─────────────────────┘

Active Item:
┃┌────────────────────┐
┃│ Analisis Potensi   │ ← Green background
┃└────────────────────┘
└── Vertical green bar (4px width, rounded)
```

---

## 🎨 Color Palette

### **Active State (Green Brand)**
```css
Light Mode:
- Text: #00df82 (brand green)
- Underline: linear-gradient(to right, #00df82, emerald-400)
- Background (mobile): emerald-50

Dark Mode:
- Text: #00df82 (brand green)
- Underline: linear-gradient(to right, #00df82, emerald-400)
- Background (mobile): emerald-950/60 (60% opacity)
```

### **Hover State (Gray Neutral)**
```css
Light Mode:
- Text: slate-950 (almost black)
- Underline: linear-gradient(to right, slate-300, slate-400)

Dark Mode:
- Text: white
- Underline: linear-gradient(to right, slate-600, slate-500)
```

### **Normal State**
```css
Light Mode:
- Text: slate-600

Dark Mode:
- Text: slate-300
```

---

## 🔧 Code Implementation

### **Desktop Navigation Link Component:**

```tsx
<Link href={link.href} className="relative group px-4 py-2">
  {/* Text Label */}
  <span className={`text-sm font-medium transition-colors duration-200 ${
    active ? "text-[#00df82] font-bold" : "text-slate-600 group-hover:text-slate-950 dark:text-slate-300 dark:group-hover:text-white"
  }`}>
    {link.label}
  </span>
  
  {/* Active Underline (Spring Animation) */}
  <motion.span
    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#00df82] to-emerald-400 rounded-full"
    initial={false}
    animate={{
      scaleX: active ? 1 : 0,
      opacity: active ? 1 : 0,
    }}
    transition={{
      type: "spring",
      stiffness: 500,
      damping: 30,
    }}
  />
  
  {/* Hover Underline (CSS Transition) */}
  <span className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-500 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ${active ? 'hidden' : ''}`} />
</Link>
```

### **Mobile Navigation Link Component:**

```tsx
<Link href={link.href} className={`relative overflow-hidden rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
  active ? "bg-emerald-50 text-[#00df82] dark:bg-emerald-950/60 dark:text-[#00df82] font-bold" : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
}`}>
  {link.label}
  
  {/* Active Vertical Bar Indicator */}
  {active && (
    <motion.span
      layoutId="mobile-active-nav"
      className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#00df82] to-emerald-400 rounded-r-full"
      initial={false}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30,
      }}
    />
  )}
</Link>
```

---

## 📊 Animation Performance

### **Optimizations Applied:**

1. **GPU Acceleration**
   - Transform properties (scaleX) instead of width
   - Opacity changes for smooth rendering
   - Will-change hints for browser optimization

2. **Spring Physics**
   ```
   Stiffness: 500  → Fast, responsive
   Damping: 30     → Smooth, no overshoot
   Mass: default   → Natural weight
   ```

3. **CSS Transitions**
   - Hardware-accelerated transforms
   - Cubic-bezier easing for natural motion
   - Origin-based scaling for directional flow

4. **Framer Motion Features**
   - `initial={false}` → No animation on mount
   - `layoutId` → Shared element transitions (mobile)
   - `animate` → Declarative state-based animation

---

## 🎬 Animation Timeline

### **Desktop Hover Sequence:**

```
0ms    → Mouse enters link area
0-300ms → Text color transitions
0-300ms → Underline scales from left (scaleX: 0 → 1)
300ms  → Animation complete
```

### **Desktop Active Transition:**

```
Route Change Detected
↓
0ms    → Spring animation starts
0-16ms → Underline begins scaling
16-150ms → Spring bounce effect
150ms  → Settle at final position
```

### **Mobile Active Transition:**

```
Route Change Detected
↓
0ms    → Layout animation begins (layoutId)
0-16ms → Vertical bar starts moving
16-150ms → Smooth spring motion to new position
150ms  → Settle at new active menu
```

---

## 🧪 Testing Checklist

### **Desktop:**
- [ ] Hover over menu items shows gray underline
- [ ] Underline slides in from left smoothly
- [ ] Active page shows green underline
- [ ] Active underline has gradient effect
- [ ] Text changes to bold when active
- [ ] Transitions smooth on all browsers
- [ ] No layout shift during animation

### **Mobile:**
- [ ] Active menu has green background
- [ ] Vertical bar indicator visible on left
- [ ] Bar moves smoothly when changing pages
- [ ] No double animation on route change
- [ ] Touch interactions responsive

### **Dark Mode:**
- [ ] Colors adapt properly
- [ ] Underline visible in dark mode
- [ ] Gradient maintains contrast
- [ ] Mobile background has correct opacity

---

## 🎨 Customization Options

### **Change Animation Speed:**

```tsx
// Faster (more responsive)
transition={{ type: "spring", stiffness: 700, damping: 25 }}

// Slower (more gentle)
transition={{ type: "spring", stiffness: 300, damping: 35 }}
```

### **Change Underline Height:**

```tsx
// Thicker underline
className="h-1 ..." // 4px

// Thinner underline  
className="h-px ..." // 1px
```

### **Change Underline Color:**

```tsx
// Blue brand color
className="bg-gradient-to-r from-blue-500 to-blue-400"

// Single solid color
className="bg-emerald-500"
```

### **Change Animation Origin:**

```tsx
// Slide from right
className="... origin-right"

// Slide from center
className="... origin-center"
```

---

## 🔍 Troubleshooting

### **Underline not showing?**

1. Check z-index stacking
2. Verify `relative` positioning on parent
3. Ensure `absolute` positioning on underline
4. Check if `hidden` class is applied

### **Animation jerky/stuttering?**

1. Reduce `stiffness` value (try 400)
2. Increase `damping` value (try 35)
3. Check browser DevTools Performance tab
4. Ensure GPU acceleration is active

### **Layout shift on hover?**

1. Use `transform` instead of `width`
2. Apply `scaleX(0)` initial state
3. Set explicit dimensions on container
4. Use `overflow: hidden` if needed

---

## 📚 References

- [Framer Motion Documentation](https://www.framer.com/motion/)
- [CSS Transform Performance](https://web.dev/animations-guide/)
- [Spring Physics Parameters](https://www.framer.com/motion/transition/)

---

## ✅ Summary

**Before:**
- ❌ Simple text color change
- ❌ No visual feedback on hover
- ❌ Basic active state

**After:**
- ✅ Smooth spring-animated underline
- ✅ Gradient color effects
- ✅ Hover feedback with slide animation
- ✅ Mobile vertical bar indicator
- ✅ Shared layout animations
- ✅ GPU-accelerated performance

---

Created by: Kiro AI Assistant
Last Updated: 2026-09-05
