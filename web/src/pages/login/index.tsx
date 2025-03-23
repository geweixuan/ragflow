import { useLogin, useRegister } from '@/hooks/login-hooks';
import { rsaPsw } from '@/utils';
import { Button, Checkbox, Form, Input } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon, useNavigate } from 'umi';

import { Domain } from '@/constants/common';
import styles from './index.less';

const Login = () => {
  const [title, setTitle] = useState('login');
  const navigate = useNavigate();
  const { login, loading: signLoading } = useLogin();
  const { register, loading: registerLoading } = useRegister();
  const { t } = useTranslation('translation', { keyPrefix: 'login' });
  const loading = signLoading || registerLoading;

  const changeTitle = () => {
    setTitle((title) => (title === 'login' ? 'register' : 'login'));
  };
  const [form] = Form.useForm();

  useEffect(() => {
    form.validateFields(['nickname']);
  }, [form]);

  const onCheck = async () => {
    try {
      const params = await form.validateFields();

      const rsaPassWord = rsaPsw(params.password) as string;

      if (title === 'login') {
        const code = await login({
          email: `${params.email}`.trim(),
          password: rsaPassWord,
        });
        if (code === 0) {
          navigate('/knowledge');
        }
      } else {
        const code = await register({
          nickname: params.nickname,
          email: params.email,
          password: rsaPassWord,
        });
        if (code === 0) {
          setTitle('login');
        }
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };
  const formItemLayout = {
    labelCol: { span: 6 },
    // wrapperCol: { span: 8 },
  };

  const toGoogle = () => {
    window.location.href =
      'https://github.com/login/oauth/authorize?scope=user:email&client_id=302129228f0d96055bee';
  };

  // 添加神经网络连接线的SVG
  const renderConnections = () => (
    <div className={styles.connections}>
      <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M100 200L300 400L500 200L700 500L900 300"
          stroke="#5A95ED"
          strokeWidth="1.5"
        />
        <path
          d="M150 300L350 500L550 300L750 600L950 400"
          stroke="#5A95ED"
          strokeWidth="1.5"
        />
        <path
          d="M200 400L400 600L600 400L800 700L950 500"
          stroke="#5A95ED"
          strokeWidth="1.5"
        />
        <path
          d="M100 600L300 400L500 600L700 400L900 600"
          stroke="#5A95ED"
          strokeWidth="1.5"
        />
        <path
          d="M200 700L400 500L600 700L800 500L950 700"
          stroke="#5A95ED"
          strokeWidth="1.5"
        />
        <path
          d="M100 800L300 600L500 800L700 600L900 800"
          stroke="#5A95ED"
          strokeWidth="1.5"
        />

        <circle cx="100" cy="200" r="4" fill="#5EC6FF" />
        <circle cx="300" cy="400" r="4" fill="#5EC6FF" />
        <circle cx="500" cy="200" r="4" fill="#5EC6FF" />
        <circle cx="700" cy="500" r="4" fill="#5EC6FF" />
        <circle cx="900" cy="300" r="4" fill="#5EC6FF" />

        <circle cx="150" cy="300" r="4" fill="#5EC6FF" />
        <circle cx="350" cy="500" r="4" fill="#5EC6FF" />
        <circle cx="550" cy="300" r="4" fill="#5EC6FF" />
        <circle cx="750" cy="600" r="4" fill="#5EC6FF" />
        <circle cx="950" cy="400" r="4" fill="#5EC6FF" />
      </svg>
    </div>
  );

  // 渲染左侧支持的模型信息
  const renderLeftInfo = () => (
    <div className={styles.sideInfoLeft}>
      <div className={styles.sideInfoContent}>
        <svg
          width="320"
          height="500"
          viewBox="0 0 320 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* 左上角装饰 */}
          <circle cx="30" cy="30" r="10" fill="#5A95ED" fillOpacity="0.2" />
          <circle cx="30" cy="30" r="6" fill="#5A95ED" fillOpacity="0.3" />
          <circle cx="30" cy="30" r="2" fill="#5EC6FF" />
          <path d="M40 30H60" stroke="#5EC6FF" strokeWidth="1" />
          <path d="M30 40V60" stroke="#5EC6FF" strokeWidth="1" />

          {/* Qwen模型图形 */}
          <g transform="translate(20, 60)">
            <rect
              x="0"
              y="0"
              width="180"
              height="70"
              rx="6"
              fill="#5A95ED"
              fillOpacity="0.05"
              stroke="#5A95ED"
              strokeWidth="1"
            />
            <text
              x="70"
              y="25"
              font-family="Arial, sans-serif"
              font-size="16"
              font-weight="600"
              fill="#5EC6FF"
            >
              Qwen
            </text>
            <path
              d="M10 40C40 40 70 25 100 40C130 55 160 35 190 45"
              stroke="#5EC6FF"
              strokeWidth="1.5"
            />
            <circle cx="10" cy="40" r="3" fill="#5EC6FF" />
            <circle cx="100" cy="40" r="3" fill="#5EC6FF" />
            <circle cx="190" cy="45" r="3" fill="#5EC6FF" />
          </g>

          {/* 右侧装饰线条 */}
          <path
            d="M250 80L280 80"
            stroke="#5EC6FF"
            strokeWidth="1"
            stroke-dasharray="3 3"
          />
          <path
            d="M260 90L290 90"
            stroke="#5EC6FF"
            strokeWidth="1"
            stroke-dasharray="3 3"
          />
          <path
            d="M270 100L300 100"
            stroke="#5EC6FF"
            strokeWidth="1"
            stroke-dasharray="3 3"
          />
          <circle
            cx="285"
            cy="120"
            r="15"
            fill="none"
            stroke="#5A95ED"
            strokeWidth="0.5"
            stroke-dasharray="2 2"
          />

          {/* DeepSeek模型图形 */}
          <g transform="translate(70, 160)">
            <rect
              x="0"
              y="0"
              width="180"
              height="70"
              rx="6"
              fill="#1570EF"
              fillOpacity="0.05"
              stroke="#1570EF"
              strokeWidth="1"
            />
            <text
              x="60"
              y="25"
              font-family="Arial, sans-serif"
              font-size="16"
              font-weight="600"
              fill="#1570EF"
            >
              DeepSeek
            </text>
            <path
              d="M20 40C40 30 60 50 80 35C100 20 120 40 140 30C160 20 180 40 200 30"
              stroke="#53B1FD"
              strokeWidth="1.5"
              strokeDasharray="2 2"
            />
            <circle cx="20" cy="40" r="3" fill="#B2DDFF" />
            <circle cx="80" cy="35" r="3" fill="#B2DDFF" />
            <circle cx="140" cy="30" r="3" fill="#B2DDFF" />
            <circle cx="200" cy="30" r="3" fill="#B2DDFF" />
          </g>

          {/* 左侧装饰线条 */}
          <path
            d="M20 200L50 200"
            stroke="#53B1FD"
            strokeWidth="1"
            stroke-dasharray="3 3"
          />
          <path
            d="M10 210L40 210"
            stroke="#53B1FD"
            strokeWidth="1"
            stroke-dasharray="3 3"
          />
          <path
            d="M15 220L45 220"
            stroke="#53B1FD"
            strokeWidth="1"
            stroke-dasharray="3 3"
          />
          <circle
            cx="30"
            cy="240"
            r="15"
            fill="none"
            stroke="#1570EF"
            strokeWidth="0.5"
            stroke-dasharray="2 2"
          />

          {/* Llama模型图形 */}
          <g transform="translate(20, 260)">
            <rect
              x="0"
              y="0"
              width="180"
              height="70"
              rx="6"
              fill="#1570EF"
              fillOpacity="0.05"
              stroke="#1570EF"
              strokeWidth="1"
            />
            <text
              x="70"
              y="25"
              font-family="Arial, sans-serif"
              font-size="16"
              font-weight="600"
              fill="#1570EF"
            >
              Llama
            </text>
            <path
              d="M10 30C30 50 50 30 70 40C90 50 110 30 130 40C150 50 170 30 190 40"
              stroke="#53B1FD"
              strokeWidth="1.5"
            />
            <circle cx="10" cy="30" r="3" fill="#B2DDFF" />
            <circle cx="70" cy="40" r="3" fill="#B2DDFF" />
            <circle cx="130" cy="40" r="3" fill="#B2DDFF" />
            <circle cx="190" cy="40" r="3" fill="#B2DDFF" />
          </g>

          {/* 网格背景装饰 */}
          <g transform="translate(220, 260)">
            <rect
              x="0"
              y="0"
              width="80"
              height="80"
              rx="4"
              fill="none"
              stroke="#1570EF"
              strokeWidth="0.5"
              stroke-dasharray="2 4"
            />
            <path
              d="M0 20H80M0 40H80M0 60H80M20 0V80M40 0V80M60 0V80"
              stroke="#1570EF"
              strokeWidth="0.3"
              stroke-dasharray="1 4"
            />
            <circle cx="40" cy="40" r="5" fill="#1570EF" fillOpacity="0.2" />
          </g>

          {/* 底部装饰元素 */}
          <g transform="translate(40, 360)">
            <rect
              x="0"
              y="0"
              width="240"
              height="60"
              rx="6"
              fill="#1570EF"
              fillOpacity="0.03"
              stroke="#1570EF"
              strokeWidth="0.5"
            />
            <text
              x="25"
              y="20"
              font-family="Arial, sans-serif"
              font-size="12"
              font-weight="600"
              fill="#1570EF"
            >
              开源模型微调
            </text>
            <path
              d="M20 40H220"
              stroke="#53B1FD"
              strokeWidth="1"
              stroke-dasharray="1 3"
            />
            <circle cx="20" cy="40" r="2" fill="#B2DDFF" />
            <circle cx="120" cy="40" r="2" fill="#B2DDFF" />
            <circle cx="220" cy="40" r="2" fill="#B2DDFF" />
          </g>

          {/* 右下角装饰 */}
          <circle
            cx="280"
            cy="450"
            r="8"
            fill="none"
            stroke="#1570EF"
            strokeWidth="0.5"
          />
          <path d="M280 442V458" stroke="#1570EF" strokeWidth="0.5" />
          <path d="M272 450H288" stroke="#1570EF" strokeWidth="0.5" />
        </svg>
      </div>
    </div>
  );

  // 渲染右侧支持的应用信息
  const renderRightInfo = () => (
    <div className={styles.sideInfoRight}>
      <div className={styles.sideInfoContent}>
        <svg
          width="320"
          height="500"
          viewBox="0 0 320 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* 右上角装饰 */}
          <circle cx="280" cy="30" r="10" fill="#5A95ED" fillOpacity="0.2" />
          <circle cx="280" cy="30" r="6" fill="#5A95ED" fillOpacity="0.3" />
          <circle cx="280" cy="30" r="2" fill="#5EC6FF" />
          <path d="M250 30H270" stroke="#5EC6FF" strokeWidth="1" />
          <path d="M280 40V60" stroke="#5EC6FF" strokeWidth="1" />

          {/* 左侧装饰线条 */}
          <path
            d="M20 50L50 50"
            stroke="#5EC6FF"
            strokeWidth="1"
            stroke-dasharray="3 3"
          />
          <path
            d="M30 60L60 60"
            stroke="#5EC6FF"
            strokeWidth="1"
            stroke-dasharray="3 3"
          />
          <path
            d="M40 70L70 70"
            stroke="#5EC6FF"
            strokeWidth="1"
            stroke-dasharray="3 3"
          />
          <circle
            cx="40"
            cy="90"
            r="15"
            fill="none"
            stroke="#5A95ED"
            strokeWidth="0.5"
            stroke-dasharray="2 2"
          />

          {/* 知识增强图形 - 右上角 */}
          <g transform="translate(140, 60)">
            <rect
              x="0"
              y="0"
              width="140"
              height="120"
              rx="6"
              fill="#5A95ED"
              fillOpacity="0.05"
            />
            <text
              x="40"
              y="25"
              font-family="Arial, sans-serif"
              font-size="16"
              font-weight="300"
              fill="#5EC6FF"
            >
              knowledge
            </text>

            {/* 中央知识图谱 */}
            <circle
              cx="70"
              cy="70"
              r="25"
              fill="none"
              stroke="#5EC6FF"
              strokeWidth="1"
            />
            <circle
              cx="70"
              cy="70"
              r="15"
              fill="none"
              stroke="#5EC6FF"
              strokeWidth="0.8"
              stroke-dasharray="2 2"
            />

            {/* 节点和连接 */}
            <circle cx="45" cy="45" r="6" fill="#5A95ED" fillOpacity="0.3" />
            <circle cx="100" cy="45" r="6" fill="#5A95ED" fillOpacity="0.3" />
            <circle cx="30" cy="80" r="6" fill="#5A95ED" fillOpacity="0.3" />
            <circle cx="110" cy="80" r="6" fill="#5A95ED" fillOpacity="0.3" />
            <circle cx="70" cy="110" r="6" fill="#5A95ED" fillOpacity="0.3" />

            <path
              d="M45 45L70 70M100 45L70 70M30 80L70 70M110 80L70 70M70 110L70 70"
              stroke="#5EC6FF"
              strokeWidth="1"
            />
          </g>

          {/* 中间装饰线条 */}
          <path
            d="M50 200L80 200"
            stroke="#5EC6FF"
            strokeWidth="1"
            stroke-dasharray="3 3"
          />
          <path
            d="M60 210L90 210"
            stroke="#5EC6FF"
            strokeWidth="1"
            stroke-dasharray="3 3"
          />
          <path
            d="M70 220L100 220"
            stroke="#5EC6FF"
            strokeWidth="1"
            stroke-dasharray="3 3"
          />
          <circle
            cx="70"
            cy="240"
            r="15"
            fill="none"
            stroke="#5A95ED"
            strokeWidth="0.5"
            stroke-dasharray="2 2"
          />

          {/* 聊天助手图形 - 中间偏左 */}
          <g transform="translate(30, 200)">
            <rect
              x="0"
              y="0"
              width="180"
              height="140"
              rx="6"
              fill="#5A95ED"
              fillOpacity="0.05"
            />
            <text
              x="60"
              y="25"
              font-family="Arial, sans-serif"
              font-size="16"
              font-weight="300"
              fill="#5EC6FF"
            >
              chat
            </text>

            {/* 聊天气泡 */}
            <rect
              x="20"
              y="40"
              width="80"
              height="30"
              rx="15"
              fill="#5A95ED"
              fillOpacity="0.2"
            />
            <path d="M20 55L10 65L20 60" fill="#5A95ED" fillOpacity="0.2" />

            <rect
              x="60"
              y="80"
              width="100"
              height="30"
              rx="15"
              fill="#5EC6FF"
              fillOpacity="0.2"
            />
            <path
              d="M160 95L170 105L160 100"
              fill="#5EC6FF"
              fillOpacity="0.2"
            />
          </g>

          {/* 右侧装饰图形 */}
          <circle
            cx="250"
            cy="260"
            r="20"
            fill="none"
            stroke="#5A95ED"
            strokeWidth="0.5"
            stroke-dasharray="4 2"
          />
          <circle
            cx="250"
            cy="260"
            r="10"
            fill="none"
            stroke="#5EC6FF"
            strokeWidth="0.5"
            stroke-dasharray="2 2"
          />
          <path d="M230 260H270" stroke="#5EC6FF" strokeWidth="0.8" />
          <path d="M250 240V280" stroke="#5EC6FF" strokeWidth="0.8" />

          {/* 装饰背景网格 */}
          <g transform="translate(230, 290)">
            <rect
              x="0"
              y="0"
              width="60"
              height="60"
              rx="4"
              fill="none"
              stroke="#5A95ED"
              strokeWidth="0.5"
              stroke-dasharray="2 4"
            />
            <path
              d="M0 15H60M0 30H60M0 45H60M15 0V60M30 0V60M45 0V60"
              stroke="#5A95ED"
              strokeWidth="0.3"
              stroke-dasharray="1 3"
            />
            <circle cx="30" cy="30" r="4" fill="#5EC6FF" fillOpacity="0.2" />
          </g>

          {/* 智能体图形 - 右下角 */}
          <g transform="translate(170, 330)">
            <rect
              x="0"
              y="0"
              width="180"
              height="120"
              rx="6"
              fill="#5A95ED"
              fillOpacity="0.05"
            />
            <text
              x="60"
              y="25"
              font-family="Arial, sans-serif"
              font-size="16"
              font-weight="300"
              fill="#5EC6FF"
            >
              agent
            </text>

            {/* 代表智能体的图形 */}
            <circle
              cx="90"
              cy="60"
              r="20"
              fill="none"
              stroke="#5EC6FF"
              strokeWidth="1.5"
            />
            <path d="M90 40L90 80" stroke="#5EC6FF" strokeWidth="1" />
            <path d="M70 60L110 60" stroke="#5EC6FF" strokeWidth="1" />

            {/* 代表连接的线 */}
            <path
              d="M50 100C60 80 120 80 130 100"
              stroke="#5EC6FF"
              strokeWidth="1"
              stroke-dasharray="2 2"
            />
            <circle cx="50" cy="100" r="4" fill="#5A95ED" fillOpacity="0.2" />
            <circle cx="130" cy="100" r="4" fill="#5A95ED" fillOpacity="0.2" />

            {/* 代表处理的几何图形 */}
            <rect
              x="30"
              y="40"
              width="10"
              height="10"
              fill="#5A95ED"
              fillOpacity="0.2"
            />
            <rect
              x="140"
              y="40"
              width="10"
              height="10"
              fill="#5A95ED"
              fillOpacity="0.2"
            />
            <path
              d="M40 45L70 45"
              stroke="#5EC6FF"
              strokeWidth="1"
              stroke-dasharray="2 2"
            />
            <path
              d="M110 45L140 45"
              stroke="#5EC6FF"
              strokeWidth="1"
              stroke-dasharray="2 2"
            />
          </g>

          {/* 左下角装饰元素 */}
          <g transform="translate(20, 370)">
            <rect
              x="0"
              y="0"
              width="120"
              height="80"
              rx="6"
              fill="#5A95ED"
              fillOpacity="0.03"
            />
            <path
              d="M10 40L110 40"
              stroke="#5EC6FF"
              strokeWidth="0.8"
              stroke-dasharray="4 2"
            />
            <circle cx="10" cy="40" r="3" fill="#5EC6FF" fillOpacity="0.3" />
            <circle cx="60" cy="40" r="3" fill="#5EC6FF" fillOpacity="0.3" />
            <circle cx="110" cy="40" r="3" fill="#5EC6FF" fillOpacity="0.3" />

            <path
              d="M30 20C45 30 75 30 90 20"
              stroke="#5EC6FF"
              strokeWidth="0.8"
            />
            <path
              d="M30 60C45 50 75 50 90 60"
              stroke="#5EC6FF"
              strokeWidth="0.8"
            />
          </g>

          {/* 底部装饰线条 */}
          <path
            d="M140 460L170 460"
            stroke="#5EC6FF"
            strokeWidth="1"
            stroke-dasharray="3 3"
          />
          <path
            d="M150 470L180 470"
            stroke="#5EC6FF"
            strokeWidth="1"
            stroke-dasharray="3 3"
          />
          <path
            d="M160 480L190 480"
            stroke="#5EC6FF"
            strokeWidth="1"
            stroke-dasharray="3 3"
          />
          <circle cx="200" cy="470" r="5" fill="#5EC6FF" fillOpacity="0.2" />
          <circle cx="220" cy="475" r="3" fill="#5EC6FF" fillOpacity="0.3" />
          <circle cx="240" cy="465" r="4" fill="#5EC6FF" fillOpacity="0.15" />
        </svg>
      </div>
    </div>
  );

  return (
    <div className={styles.loginPage}>
      {/* 神经网络连接线 */}
      {renderConnections()}

      {/* 左侧模型信息 */}
      {renderLeftInfo()}

      {/* 右侧应用信息 */}
      {renderRightInfo()}

      <div className={styles.loginLeft}>
        <div className={styles.leftContainer}>
          <div className={styles.loginTitle}>
            <div>{title === 'login' ? t('login') : t('register')}</div>
            <span>
              {title === 'login'
                ? t('loginDescription')
                : t('registerDescription')}
            </span>
          </div>

          <Form
            form={form}
            layout="vertical"
            name="dynamic_rule"
            style={{ width: '100%' }}
          >
            <Form.Item
              {...formItemLayout}
              name="email"
              label={t('emailLabel')}
              rules={[{ required: true, message: t('emailPlaceholder') }]}
            >
              <Input size="large" placeholder={t('emailPlaceholder')} />
            </Form.Item>
            {title === 'register' && (
              <Form.Item
                {...formItemLayout}
                name="nickname"
                label={t('nicknameLabel')}
                rules={[{ required: true, message: t('nicknamePlaceholder') }]}
              >
                <Input size="large" placeholder={t('nicknamePlaceholder')} />
              </Form.Item>
            )}
            <Form.Item
              {...formItemLayout}
              name="password"
              label={t('passwordLabel')}
              rules={[{ required: true, message: t('passwordPlaceholder') }]}
            >
              <Input.Password
                size="large"
                placeholder={t('passwordPlaceholder')}
                onPressEnter={onCheck}
              />
            </Form.Item>
            {title === 'login' && (
              <Form.Item name="remember" valuePropName="checked">
                <Checkbox> {t('rememberMe')}</Checkbox>
              </Form.Item>
            )}
            <div style={{ marginBottom: '20px' }}>
              {title === 'login' && (
                <div>
                  {t('signInTip')}
                  <Button type="link" onClick={changeTitle}>
                    {t('signUp')}
                  </Button>
                </div>
              )}
              {title === 'register' && (
                <div>
                  {t('signUpTip')}
                  <Button type="link" onClick={changeTitle}>
                    {t('login')}
                  </Button>
                </div>
              )}
            </div>
            <Button
              type="primary"
              block
              size="large"
              onClick={onCheck}
              loading={loading}
            >
              {title === 'login' ? t('login') : t('continue')}
            </Button>
            {title === 'login' && location.host === Domain && (
              <Button
                block
                size="large"
                onClick={toGoogle}
                style={{ marginTop: 15 }}
              >
                <div className="flex items-center">
                  <Icon
                    icon="local:github"
                    style={{ verticalAlign: 'middle', marginRight: 5 }}
                  />
                  Sign in with Github
                </div>
              </Button>
            )}
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
