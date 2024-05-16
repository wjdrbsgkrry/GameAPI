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

router.post('/characterCreate', async (req, res) => {
  let { name, status, count, _id, item = null } = await req.body;

  const isCount = await characterModel.findOne().sort('-count').exec();

  count = (await isCount) !== null ? isCount.count + 1 : 1;
  characterLister.push({ name, status, count, _id });
  const newCharacter = new characterModel({ name, status, count, _id, item });
  newCharacter.save();

  return res.status(201).json({ newCharacter });
});

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

router.get('/characterFind/:id', async (req, res) => {
  const { id } = req.params;
  const character = await characterModel.findById(id).select('-_id').exec();

  if (!character)
    return res.status(404).json({ errorMessage: '존재하지 않는 계정입니다.' });

  characterLister.push({ character });
  return res.status(200).json({ character });
});

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

router.patch('/characterItemEquip/:itemId/:characterId', async (req, res) => {
  const { itemId, characterId } = req.params;
  const item = await itemModel.findById(itemId).exec();
  const character = await characterModel.findById(characterId).exec();

  if (!character || !item) {
    return res.status(404).json({
      errorMessage: '캐릭터 id 또는 아이템 id가 올바르지 않습니다.',
    });
  }

  if (character.item) {
    return res
      .status(404)
      .json({ errorMessage: '이미 장착중인 아이템이 있습니다.' });
  }

  character.item = item;
  character.status += item.status;
  character.save();
  return res.status(200).json({ character });
});

router.patch(
  '/characterItemUnequipped/:itemId/:characterId',
  async (req, res) => {
    const { itemId, characterId } = req.params;
    const item = await itemModel.findById(itemId).exec();
    const character = await characterModel.findById(characterId).exec();

    if (!character || !item) {
      return res.status(404).json({
        errorMessage: '캐릭터 id 또는 아이템 id가 올바르지 않습니다.',
      });
    }

    if (!character.item) {
      return res.status(404).json({
        errorMessage: '장착중인 아이템이 없습니다.',
      });
    }

    character.item = null;
    character.status -= item.status;
    character.save();
    return res.status(200).json({ character });
  }
);

router.get('/characterItemWatch/:characterId', async (req, res) => {
  const { characterId } = req.params;
  const character = await characterModel.findById(characterId).exec();
  if (!character || !character.item) {
    return res
      .status(404)
      .json({ errorMessage: '캐릭터 id 또는 장착된 아이템이 없습니다.' });
  }
  const item = await itemModel
    .findById(character.item._id)
    .select('-_id')
    .exec();
  return res.status(200).json(item);
});

export default router;
