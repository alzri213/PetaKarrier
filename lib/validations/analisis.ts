import { z } from "zod";

export const ProfilUserSchema = z.object({
  minat: z
    .array(
      z.enum([
        "Kuliner",
        "Fashion",
        "Kreatif",
        "Jasa",
        "Agribisnis",
        "Digital",
        "Kecantikan",
        "Pendidikan",
      ])
    )
    .min(1, "Pilih minimal 1 kategori minat"),
  skill: z.array(z.string()).min(1, "Pilih minimal 1 keterampilan"),
  budget: z.number().positive("Budget harus lebih dari 0"),
  waktu: z.enum(["full", "parttime", "sampling"]),
  pengalaman: z.enum(["pemula", "pernah", "sudah"]),
});

export const HitungModalSchema = z.object({
  usahaId: z.string().min(1, "Pilih jenis usaha"),
  kotaId: z.string().min(1, "Pilih kota domisili"),
  skala: z.enum(["kecil", "sedang", "besar"]).default("kecil"),
});

export type ProfilUserInput = z.infer<typeof ProfilUserSchema>;
export type HitungModalInputType = z.infer<typeof HitungModalSchema>;
