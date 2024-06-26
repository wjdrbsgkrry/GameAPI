import express from 'express';
import characterModel from '../schemas/characters.schema.js';
import itemModel from '../schemas/item.schema.js';

const router = express.Router();

router.post('/characterCreate', async (req, res) => {
  try {
    let { name, status, count, _id, item } = await req.body;
    const isCount = await characterModel.findOne().sort('-count').exec();
    count = (await isCount) !== null ? isCount.count + 1 : 1;
    const newCharacter = new characterModel({ name, status, count, _id, item });
    newCharacter.save();
    return res.status(201).json({ newCharacter });
  } catch {
    return res.status(404).json({ errorMessage });
  }
});

router.delete('/characterDelete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const character = await characterModel.findById(id).exec();

    if (!character)
      return res
        .status(404)
        .json({ errorMessage: '존재하지 않는 계정입니다.' });

    await characterModel.deleteOne({ _id: id });
    return res.status(200).json({});
  } catch {
    return res.status(404).json({ errorMessage });
  }
});

router.get('/characterFind/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const character = await characterModel
      .findOne({ _id: id })
      .select('-_id')
      .exec();

    if (!character)
      return res
        .status(404)
        .json({ errorMessage: '존재하지 않는 계정입니다.' });
    return res.status(200).json({ character });
  } catch {
    return res.status(404).json({ errorMessage });
  }
});

router.patch('/characterItemEquip/:itemId/:characterId', async (req, res) => {
  const { itemId, characterId } = req.params;
  const item = await itemModel.findOne({ _id: itemId }).exec();
  const character = await characterModel.findOne({ _id: characterId }).exec();

  if (!character || !item) {
    return res.status(404).json({
      errorMessage: '캐릭터 id 또는 아이템 id가 올바르지 않습니다.',
    });
  }
  const isItem = character.item.some((obj) => obj == itemId);
  if (isItem) {
    return res
      .status(404)
      .json({ errorMessage: '이미 장착중인 아이템입니다.' });
  }

  character.item.push(item._id);
  character.status += item.status ?? 0;
  await character.save();
  return res.status(200).json({ character });
});

router.patch(
  '/characterItemUnequipped/:itemId/:characterId',
  async (req, res) => {
    const { itemId, characterId } = req.params;
    const item = await itemModel.findOne({ _id: itemId }).exec();
    const character = await characterModel.findOne({ _id: characterId }).exec();

    if (!character || !item) {
      return res.status(404).json({
        errorMessage: '캐릭터 id 또는 아이템 id가 올바르지 않습니다.',
      });
    }

    if (character.item == []) {
      return res.status(404).json({
        errorMessage: '장착중인 아이템이 없습니다.',
      });
    }

    const itemIndex = character.item.findIndex((item) => item._id == itemId);

    if (itemIndex === -1) {
      return res.status(400).json({ message: 'item not equipped' });
    }

    const itemToUnequip = character.item[itemIndex];

    character.status -= item.status ?? 0;
    character.item.splice(itemIndex, 1);
    await character.save();

    return res.status(200).json({ character });
  }
);

router.get('/characterItemWatch/:characterId', async (req, res) => {
  try {
    const { characterId } = req.params;
    const character = await characterModel.findById(characterId).exec();

    if (!character || character.item == []) {
      return res
        .status(404)
        .json({ errorMessage: '캐릭터 id 또는 장착된 아이템이 없습니다.' });
    }

    return res.status(200).json(character.item);
  } catch {
    return res.status(404).json({ errorMessage });
  }
});

export default router;
