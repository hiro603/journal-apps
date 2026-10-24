import { beforeEach, describe, expect, it } from "vitest";
import type { JournalRepository } from "../repository";
import { JournalDB } from "./db";
import { createDexieRepository } from "./repository";

type TestFields = { score: number | null };

const photoInput = () => ({
  image: new Blob(["image"], { type: "image/jpeg" }),
  thumb: new Blob(["thumb"], { type: "image/jpeg" }),
  width: 1200,
  height: 900,
});

let repo: JournalRepository<TestFields>;

beforeEach(async () => {
  const db = new JournalDB<TestFields>(`test-${crypto.randomUUID()}`);
  repo = createDexieRepository(db);
});

describe("記録", () => {
  it("作成した記録を日付で引ける", async () => {
    const created = await repo.create({ date: "2026-10-24", fields: { score: null } });

    expect(await repo.findByDate("2026-10-24")).toEqual([created]);
    expect(created.note).toBe("");
  });

  it("月で引くと、その月の記録だけが日付順で返る", async () => {
    await repo.create({ date: "2026-10-31", fields: { score: 1 } });
    await repo.create({ date: "2026-10-01", fields: { score: 2 } });
    await repo.create({ date: "2026-11-01", fields: { score: 3 } });

    const dates = (await repo.findByMonth("2026-10")).map((e) => e.date);
    expect(dates).toEqual(["2026-10-01", "2026-10-31"]);
  });

  it("更新するとメモと項目が変わり updatedAt が進む", async () => {
    const created = await repo.create({ date: "2026-10-24", fields: { score: null } });
    await new Promise((r) => setTimeout(r, 2));

    await repo.update(created.id, { note: "ラーメン", fields: { score: 5 } });

    const [updated] = await repo.findByDate("2026-10-24");
    expect(updated.note).toBe("ラーメン");
    expect(updated.fields).toEqual({ score: 5 });
    expect(updated.updatedAt).toBeGreaterThan(created.updatedAt);
  });
});

describe("写真", () => {
  it("記録ごとに追加順で返り、削除できる", async () => {
    const entry = await repo.create({ date: "2026-10-24", fields: { score: null } });
    const other = await repo.create({ date: "2026-10-25", fields: { score: null } });
    const first = await repo.addPhoto(entry.id, photoInput());
    await new Promise((r) => setTimeout(r, 2));
    const second = await repo.addPhoto(entry.id, photoInput());
    await repo.addPhoto(other.id, photoInput());

    expect((await repo.listPhotos(entry.id)).map((p) => p.id)).toEqual([first.id, second.id]);

    await repo.removePhoto(first.id);
    expect((await repo.listPhotos(entry.id)).map((p) => p.id)).toEqual([second.id]);
  });

  it("複数の記録の写真をまとめて追加順で引ける", async () => {
    const a = await repo.create({ date: "2026-10-01", fields: { score: null } });
    const b = await repo.create({ date: "2026-10-02", fields: { score: null } });
    const c = await repo.create({ date: "2026-10-03", fields: { score: null } });
    const pa = await repo.addPhoto(a.id, photoInput());
    await new Promise((r) => setTimeout(r, 2));
    const pb = await repo.addPhoto(b.id, photoInput());
    await repo.addPhoto(c.id, photoInput());

    expect((await repo.listPhotosByEntries([b.id, a.id])).map((p) => p.id)).toEqual([pa.id, pb.id]);
  });

  it("Blob が Blob のまま保存される", async () => {
    const entry = await repo.create({ date: "2026-10-24", fields: { score: null } });
    await repo.addPhoto(entry.id, photoInput());

    const [photo] = await repo.listPhotos(entry.id);
    expect(photo.image).toBeInstanceOf(Blob);
    expect(await photo.image.text()).toBe("image");
  });
});
