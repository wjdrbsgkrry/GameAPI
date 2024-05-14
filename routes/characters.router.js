import express from 'express';
import characterModel from '../schemas/characters.schema.js';
import itemModel from '../schemas/item.schema.js';

const router = express.Router();

let characterLister = [];
let itemLister = [];

router.get('/characters', async (req, res) => {
  return res.status(201).json({ characterLister });
});

router.get('/items', async (req, res) => {
  return res.status(201).json({ itemLister });
});

/** 캐릭터 생성 **/
router.post('/characterCreate', async (req, res) => {
  let { name, status, count, _id } = await req.body;

  const isCount = await characterModel.findOne().sort('-count').exec();

  count = (await isCount) !== null ? isCount.count + 1 : 1;
  characterLister.push({ name, status, count, _id });
  const newCharacter = new characterModel({ name, status, count, _id });
  newCharacter.save();

  return res.status(201).json({ newCharacter });
});

/** 캐릭터 삭제 **/
router.delete('/characterDelete/:id', async (req, res) => {
  const { id } = req.params;

  const character = await characterModel.findById(id).exec();
  console.log(character);
  if (!character)
    return res.status(404).json({ errorMessage: '존재하지 않는 계정입니다.' });

  await characterModel.deleteOne({ _id: id });
  const index = characterLister.findIndex(
    (element) => element === character._id
  );
  characterLister.splice(index, 1);
  return res.status(200).json({});
});

/** 캐릭터 조회 **/
router.get('/characterFind/:id', async (req, res) => {
  const { id } = req.params;
  const character = await characterModel.findById(id).select('-_id').exec();

  if (!character)
    return res.status(404).json({ errorMessage: '존재하지 않는 계정입니다.' });

  characterLister.push({ character });
  return res.status(200).json({ character });
});

/** 아이템 생성 **/
router.post('/itemCreate', async (req, res) => {
  let { code, name, status, _id } = await req.body;

  const isCode = await itemModel.findOne().sort('-code').exec();

  code = (await isCode) !== null ? isCode.code + 1 : 1;
  itemLister = [];
  itemLister.push({ code, name, status, _id });
  const newItem = new itemModel({ code, name, status, _id });
  newItem.save();

  return res.status(201).json({ newItem });
});

/** 아이템 조회 **/
router.get('/itemFind/:id', async (req, res) => {
  const { id } = req.params;
  const item = await itemModel.findById(id).select('-_id').exec();

  if (!item)
    return res
      .status(404)
      .json({ errorMessage: '존재하지 않는 아이템입니다.' });

  itemLister = [];
  itemLister.push({ item });
  return res.status(200).json({ item });
});

/** 아이템 수정 **/
router.patch('/itemPatch/:id', async (req, res) => {
  const { id } = req.params;
  const { name, status, code } = req.body;

  const item = await itemModel.findById(id).exec();
  if (!item) {
    return res
      .status(404)
      .json({ errorMessage: '존재하지 않는 아이템입니다.' });
  }

  if (!name)
    return res.status(404).json({ errorMessage: '입력값이 없습니다.' });
  else {
    item.name = name;
    item.status = status;
    item.save();

    itemLister = [];
    itemLister.push({ item });

    return res.status(200).json({ item });
  }
});

/** 모든 아이템 조회 **/
router.get('/itemAllFind', async (req, res) => {
  try {
    const items = await itemModel.find();
    itemLister = [];
    itemLister = [...items];
    return res.status(200).json({ items });
  } catch (err) {
    return res.status(500).json({ error: 'database failure' });
  }
});

export default router;
