import express from 'express';
import itemModel from '../schemas/item.schema.js';

const router = express.Router();

router.post('/itemCreate', async (req, res) => {
    try{
      let { code, name, status, _id } = await req.body;
      const isCode = await itemModel.findOne().sort('-code').exec();
    
      code = (await isCode) !== null ? isCode.code + 1 : 1;
      const newItem = new itemModel({ code, name, status, _id });
      newItem.save();
    
      return res.status(201).json({ newItem });
    }catch{
      return res.status(404).json({ errorMessage });
    }
  });
  
  router.get('/itemFind/:id', async (req, res) => {
    try{
      const { id } = req.params;
      const item = await itemModel.findById(id).select('-_id').exec();
    
      if (!item)
        return res
          .status(404)
          .json({ errorMessage: '존재하지 않는 아이템입니다.' });
    
      return res.status(200).json({ item });
    }catch{
      return res.status(404).json({ errorMessage });
    }
  });
  
  router.patch('/itemPatch/:id', async (req, res) => {
    try{
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
  
      item.name = name;
      item.status = status;
      item.save();
      return res.status(200).json({ item });
    
  }catch{
    return res.status(404).json({ errorMessage });
  }
  });
  
  router.get('/itemAllFind', async (req, res) => {
    try {
      const items = await itemModel.find();
      return res.status(200).json({ items });
    } catch (err) {
      return res.status(500).json({ error: 'database failure' });
    }
  });