<template>
  <div>
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" :size="formSize" class="demo-ruleForm" label-width="200px" status-icon>
      <el-form-item label="转换业务标志">
        <el-cascader v-model="ruleForm.form" :options="cascaderOptions" clearable collapse-tags />
      </el-form-item>

      <el-form-item label="保额形式">
        <el-radio-group v-model="ruleForm.radio" style="display: flex; flex-direction: column; align-items: flex-start">
          <div>
            <el-radio :label="3">平均保额</el-radio>
          </div>
          <div>
            <el-radio :label="6">递增型 </el-radio>
            <div style="margin-left: 20px">
              <el-radio-group v-model="ruleForm.radiob" :disabled="!(ruleForm.radio == 6)" style="display: flex; flex-direction: column; align-items: flex-start">
                <div>
                  <el-radio :label="3" style="display: flex; width: auto; height: auto"
                    >复利增长率
                    <div>
                      <el-input v-model="ruleForm.radiobinput" :disabled="!(ruleForm.radiob == 3)" style="resize: none; min-height: 43.5px; height: 43.5px"></el-input></div
                  ></el-radio>
                </div>
                <div>
                  <el-radio :label="6" style="display: flex; width: auto; height: auto"
                    >其他
                    <div>
                      <el-input v-model="ruleForm.radiobinput2" :disabled="!(ruleForm.radiob == 6)" style="resize: none; min-height: 43.5px; height: 43.5px"></el-input></div
                  ></el-radio>
                </div>
              </el-radio-group>
            </div>
          </div>
          <div>
            <el-radio :label="9">递减型</el-radio>
          </div>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="时间">
        <el-date-picker v-model="ruleForm.value4" type="dates" placeholder="选择时间" />
      </el-form-item>
      <el-form-item label="保险公司全称：" prop="dName">
        <el-input v-model="ruleForm.dName" disabled />
      </el-form-item>

      <el-form-item label="产品名称：" prop="name">
        <el-input v-model="ruleForm.name" />
      </el-form-item>
      <el-form-item label="备案类型：" prop="code">
        <el-select v-model="ruleForm.code" placeholder="请选择">
          <el-option label="新产品备案" value="1" />
          <el-option label="变更备案" value="2" />
          <el-option label="特殊业务备案" value="3" />
          <el-option label="停售备案" value="4" />
          <el-option label="复售备案" value="5" />
        </el-select>
      </el-form-item>
      <el-form-item label="实际经营所在地：" prop="form">
        <el-cascader v-model="ruleForm.form" :options="cascaderOptions" :props="{ multiple: true }" clearable collapse-tags />
      </el-form-item>
      <el-form-item label="是否有电子保单：" prop="electronic">
        <el-select v-model="ruleForm.electronic" placeholder="请选择">
          <el-option label="是" value="1" />
          <el-option label="否" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="是否是国产密码算法：" prop="algorithm">
        <el-select v-model="ruleForm.algorithm" :disabled="!(ruleForm.electronic === '1')" placeholder="请选择">
          <el-option label="是" value="1" />
          <el-option label="否" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="产品业务类型：" prop="productType">
        <el-select v-model="ruleForm.productType" multiple placeholder="请选择" style="width: 240px">
          <el-option v-for="item in productTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <div class="biao" data-v-308367da=""><h5 data-v-308367da="">短期保险续保规定</h5></div>
      <el-form-item label="联系电话：" prop="electronic">
        <el-input v-model="ruleForm.phone" maxlength="4" style="width: 80px" />
        <span>-</span>
        <el-input v-model="ruleForm.areaCode" style="width: 200px" />
      </el-form-item>
      <el-form-item label="计划销售日期：" prop="date">
        <el-date-picker v-model="ruleForm.date" label="计划销售日期" placeholder="Pick a date" style="width: 100%" type="date" />
      </el-form-item>

      <el-form-item label="重大疾病病种数：">
        <el-radio-group v-model="ruleForm.number">
          <el-radio :label="1">少儿重大疾病保险</el-radio>
          <el-radio :label="2">仅包含6种重度疾病</el-radio>
          <el-radio :label="3"> 含6种重度疾病，但少于2020版28种疾病，且在65周岁以上的承保病种包括严重阿尔茨海默病和严重原发性帕金森病 </el-radio>
          <el-radio :label="4"> 含6种重度疾病，但少于2020版28种疾病，且在65周岁以上的承保病种不包括严重阿尔茨海默病和严重原发性帕金森病 </el-radio>
          <el-radio :label="5">2020版28种病种</el-radio>
          <el-radio :label="6">包含但超过28病种（填写）</el-radio>
          <div>
            <el-input v-model="ruleForm.numberValue" :disabled="ruleForm.number !== 6" style="width: 50px"></el-input>
          </div>
          <span class="el-radio__label" style="padding-left: 0; font-size: 10px">种</span>
        </el-radio-group>
      </el-form-item>

      <div class="biao" data-v-308367da=""><h5 data-v-308367da="">交费期限</h5></div>

      <el-form-item label="首次生存金（不含满期金）给付年度：">
        <el-radio-group v-model="ruleForm.survival">
          <el-radio :label="1">保单生效</el-radio>
          <div>
            <el-input v-model="ruleForm.policy" :disabled="ruleForm.survival !== 1" style="width: 50px"></el-input>
          </div>
          <span class="el-radio__label" style="padding-left: 0; font-size: 10px">年后</span>
          <el-radio :label="2">其他：</el-radio>
          <div>
            <el-input v-model="ruleForm.else" :disabled="ruleForm.survival !== 2" style="resize: none; min-height: 43.5px; height: 43.5px"></el-input>
          </div>
          <span class="el-radio__label" style="padding-left: 0; font-size: 10px"></span>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="年度佣金费用率上限：">
        <div class="el-form-item__content" style="margin-left: 380px">
          <span class="el-radio__label" style="padding-left: 0">趸交:</span>
          <el-input v-model="ruleForm.year1" style="width: 50px"></el-input>
          <span class="el-radio__label" style="padding-left: 0">%;</span><span class="el-radio__label" style="padding-left: 0px">期交:</span>
          <el-input v-model="ruleForm.year2" style="width: 50px"></el-input>
          <span class="el-radio__label" style="padding-left: 0">%</span>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)"> Create</el-button>
        <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';

const formSize = ref('default');
const ruleFormRef = ref<FormInstance>();
let cascaderOptions = [
  {
    value: 10,
    label: '中国境内(不包含香港、澳门、台湾)',
    children: [
      { value: 11, label: '北京' },
      { value: 12, label: '天津' },
      { value: 13, label: '河北' },
      { value: 14, label: '山西' },
      { value: 15, label: '内蒙古' },
      { value: 16, label: '辽宁' },
      { value: 17, label: '大连' },
      { value: 18, label: '吉林' },
      { value: 19, label: '黑龙江' },
      { value: 112, label: '上海' },
      { value: 113, label: '江苏' },
      { value: 114, label: '浙江' },
      { value: 115, label: '宁波' },
      { value: 116, label: '安徽' },
      { value: 117, label: '福建' },
      { value: 118, label: '厦门' },
      { value: 119, label: '江西' },
      { value: 120, label: '山东' },
      { value: 121, label: '青岛' },
      { value: 122, label: '河南' },
      { value: 123, label: '湖南' },
      { value: 124, label: '湖北' },
      { value: 125, label: '广东' },
      { value: 126, label: '深圳' },
      { value: 127, label: '广西' },
      { value: 128, label: '海南' },
      { value: 129, label: '重庆' },
      { value: 130, label: '四川' },
      { value: 131, label: '贵州' },
      { value: 132, label: '云南' },
      { value: 133, label: '西藏' },
      { value: 134, label: '陕西' },
      { value: 135, label: '甘肃' },
      { value: 136, label: '青海' },
      { value: 137, label: '宁夏' },
      { value: 138, label: '新疆' },
    ],
  },
  {
    value: 14,
    label: '澳门',
  },
  {
    value: 23,
    label: '香港',
  },
];

let productTypeOptions = [
  {
    value: 1,
    label: '税优健康险产品',
  },
  {
    value: 2,
    label: '非特定业务产品',
  },
  {
    value: 3,
    label: '个人养老金产品',
  },
];
const ruleForm = reactive({
  dName: '华夏人寿保险股份有限公司',
  name: '华夏银保会',
  code: '',
  form: [],
  radio: '',
  radiob: '',
  radiobinput: '',
  radiobinput2: '',
  electronic: '',
  algorithm: '',
  areaCode: '', //区号
  phone: '', // 手机号
  date: '', // 计划销售日期
  productType: [1, 2], // 产品业务类型
  numberValue: '',
  number: '',
  year1: '',
  year2: '',
  year3: '',
  else: '',
  policy: '',
  survival: '',
  value4: '',
});

const rules = reactive<FormRules>({
  name: [
    { required: true, message: 'Please input Activity name', trigger: 'blur' },
    { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
  ],
  code: [
    {
      required: true,
      message: '请选择产品',
      trigger: 'change',
    },
  ],
  form: [
    {
      required: true,
      message: '请选择',
      trigger: 'change',
    },
  ],
  electronic: [
    {
      required: true,
      message: '必填',
      trigger: 'change',
    },
  ],
  date: [
    {
      type: 'date',
      required: true,
      message: '必填',
      trigger: 'change',
    },
  ],
  type: [
    {
      type: 'array',
      required: true,
      message: 'Please select at least one activity type',
      trigger: 'change',
    },
  ],
  resource: [
    {
      required: true,
      message: 'Please select activity resource',
      trigger: 'change',
    },
  ],
  desc: [{ required: true, message: 'Please input activity form', trigger: 'blur' }],
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!');
    } else {
      console.log('error submit!', fields);
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

const options = Array.from({ length: 10000 }).map((_, idx) => ({
  value: `${idx + 1}`,
  label: `${idx + 1}`,
}));
</script>
<style>
.demo-ruleForm {
  margin: 50px 100px 0 100px;
}
</style>
