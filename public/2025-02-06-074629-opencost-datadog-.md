---
title: 'OpenCost & Datadog 実践ガイド: クラウドコスト最適化で無駄を削減'
tags:
  - kubernetes
  - Datadog
  - クラウドコスト
  - コスト最適化
  - OpenCost
private: false
updated_at: '2025-02-06T07:48:20+09:00'
id: e7820664392fb7cc9ab3
organization_url_name: null
slide: false
ignorePublish: false
---

# OpenCost & Datadog 実践ガイド: クラウドコスト最適化で無駄を削減する

クラウドコストは、企業の成長とともに増加する悩みの種です。適切な可視化と対策を講じなければ、無駄なコストが膨らみ続け、ビジネスの成長を阻害する可能性があります。本記事では、Kubernetes環境におけるコスト可視化ツールであるOpenCostと、統合監視プラットフォームであるDatadogを連携させることで、クラウドコストを最適化し、無駄を削減する方法を実践的に解説します。

この記事を読むことで、読者は以下の知識とスキルを習得できます。

*   OpenCostのインストールと初期設定
*   OpenCostのメトリクスをDatadogに取り込む方法
*   Datadogでコスト分析ダッシュボードを構築する方法
*   コスト最適化のためのアラート設定
*   実践的なコスト削減テクニック
*   OpenCostとDatadog連携におけるトラブルシューティング

## 1. はじめに: なぜOpenCostとDatadogなのか？ - クラウドコストの現状と課題

クラウドネイティブなアプリケーションが増加するにつれて、Kubernetes環境のコスト管理は複雑化しています。従来の監視ツールでは、コンテナやPodといった細かな粒度でのコストを把握することが難しく、リソースの無駄遣いを発見しにくいという課題がありました。

OpenCostは、Kubernetes環境のコストを可視化するためのオープンソースツールです。CPU、メモリ、ストレージ、ネットワークなどのリソース使用量に基づいて、Pod、Namespace、Deploymentなどの単位でコストを算出できます。

Datadogは、インフラストラクチャ、アプリケーション、ログなどを統合的に監視できるプラットフォームです。OpenCostと連携することで、Kubernetesのコスト情報をDatadog上で一元的に管理し、より詳細な分析やアラート設定が可能になります。

OpenCostとDatadogを組み合わせることで、以下のメリットが得られます。

*   Kubernetes環境のコストを詳細に可視化できる
*   コストに関する異常を早期に検知できる
*   コスト削減のための具体的なアクションを実行できる
*   継続的なコスト最適化を実現できる

## 2. OpenCostセットアップ: Kubernetesコスト可視化の第一歩 - Helmチャートによる簡単インストールと初期設定

OpenCostは、Helmチャートを使用して簡単にインストールできます。まず、Helmがインストールされていることを確認してください。

```bash
helm version
```

次に、OpenCostのリポジトリを追加します。

```bash
helm repo add opencost https://opencost.github.io/opencost
helm repo update
```

OpenCostをインストールします。

```bash
helm install opencost opencost/opencost --namespace opencost --create-namespace
```

インストール後、OpenCostのUIにアクセスできます。デフォルトでは、ポート9090で公開されています。

```bash
kubectl port-forward --namespace opencost service/opencost 9090:9090
```

ブラウザで `http://localhost:9090` にアクセスすると、OpenCostのUIが表示されます。

OpenCostの設定は、`values.yaml` ファイルを編集することでカスタマイズできます。例えば、通貨を変更したり、ストレージのプロビジョニング方法を設定したりできます。

```yaml
# values.yaml
currencyCode: JPY
```

設定を変更したら、Helmでアップグレードします。

```bash
helm upgrade opencost opencost/opencost --namespace opencost -f values.yaml
```

## 3. Datadog連携: OpenCostメトリクスをDatadogに取り込み、統合的な監視基盤を構築 - APIキー設定とDatadog Agentの設定

OpenCostのメトリクスをDatadogに取り込むには、Datadog Agentの設定が必要です。まず、DatadogのAPIキーを取得します。DatadogのWebサイトで、[組織設定] -> [APIキー] からAPIキーを生成します。

次に、Datadog AgentにOpenCostのインテグレーションを追加します。Datadog Agentの設定ファイル（`datadog.yaml`）に、以下の設定を追加します。

```yaml
# datadog.yaml
init_config:

instances:
  - opencost_url: http://opencost.opencost.svc.cluster.local:9090 # OpenCostのURL
    collect_kubernetes_labels: true
    extra_kubernetes_label_transformers:
      pod_name:
        - source_name: pod
          target_name: k8s.pod.name
      namespace:
        - source_name: namespace
          target_name: k8s.namespace.name
```

`opencost_url` は、OpenCostのURLに合わせて変更してください。 `collect_kubernetes_labels` を `true` に設定することで、Kubernetesのラベルもメトリクスと一緒にDatadogに送信されます。

設定ファイルを変更したら、Datadog Agentを再起動します。

```bash
sudo systemctl restart datadog-agent
```

DatadogのWebサイトで、[メトリクスエクスプローラ] を開くと、OpenCostのメトリクスが表示されます。メトリクスのプレフィックスは `opencost` です。例えば、CPUコストは `opencost.cpu_cost` というメトリクスで確認できます。

## 4. コスト分析ダッシュボード構築: Datadogでコスト効率を最大化するカスタムダッシュボード作成 - CPU使用率、メモリ使用量、ネットワークトラフィックとコストの相関分析

Datadogでコスト分析ダッシュボードを作成することで、コスト効率を最大化できます。ダッシュボードには、以下の情報を表示することをおすすめします。

*   CPUコスト
*   メモリコスト
*   ネットワークコスト
*   ストレージコスト
*   Namespaceごとのコスト
*   Deploymentごとのコスト
*   Podごとのコスト

これらの情報をグラフで表示することで、コストの傾向を把握しやすくなります。また、CPU使用率、メモリ使用量、ネットワークトラフィックなどのリソース使用量とコストを相関分析することで、無駄なリソースを発見できます。

例えば、CPU使用率が低いのにCPUコストが高いPodがあれば、リソースを削減するなどの対策を検討できます。

Datadogのダッシュボードは、ドラッグアンドドロップで簡単に作成できます。グラフの種類や表示形式も自由にカスタマイズできます。

以下は、Datadogのダッシュボード定義の例です。

```json
[
  {
    "definition": {
      "title": "CPU Cost by Namespace",
      "title_size": "16",
      "title_align": "left",
      "type": "timeseries",
      "requests": [
        {
          "q": "sum:opencost.cpu_cost{*} by {k8s.namespace.name}",
          "display_type": "line",
          "style": {
            "palette": "cool",
            "line_type": "solid",
            "line_width": "normal"
          },
          "metadata": [
            {
              "expression": "k8s.namespace.name",
              "alias": "Namespace"
            }
          ]
        }
      ]
    },
    "layout": {
      "x": 0,
      "y": 0,
      "width": 12,
      "height": 6
    }
  }
]
```

このJSONをDatadogにインポートすることで、CPUコストをNamespaceごとに表示するダッシュボードを作成できます。

## 5. コスト最適化のためのアラート設定: 無駄なコストを早期発見するアラート戦略 - コスト超過、リソースアイドル状態、異常なコスト変動に対するアラート設定例

Datadogのアラート機能を利用することで、無駄なコストを早期に発見できます。以下のようなアラートを設定することをおすすめします。

*   コスト超過アラート：特定のNamespaceやDeploymentのコストが、設定した閾値を超えた場合に通知する
*   リソースアイドル状態アラート：CPU使用率やメモリ使用率が低い状態が続いた場合に通知する
*   異常なコスト変動アラート：コストが急激に増加した場合に通知する

例えば、特定のNamespaceのコストが過去1週間の平均値よりも20%以上増加した場合に通知するアラートは、以下のように設定できます。

```json
{
  "name": "Namespace Cost Increase",
  "message": "Namespace {{k8s.namespace.name}} cost has increased by more than 20% in the last week.",
  "query": "avg(last_1h):sum:opencost.total_cost{k8s.namespace.name:*} > 1.2 * avg(last_1w):sum:opencost.total_cost{k8s.namespace.name:*}",
  "thresholds": {
    "critical": 1
  },
  "tags": [
    "cost",
    "kubernetes"
  ]
}
```

アラートの通知先は、SlackやPagerDutyなど、様々なチャネルを設定できます。

## 6. 実践的なコスト削減テクニック: リソース最適化、オートスケーリング、スポットインスタンス活用 - 具体的な設定例と効果測定

コスト削減のためには、以下のテクニックを実践することをおすすめします。

*   **リソース最適化:** Podのリソースリクエストとリミットを適切に設定し、リソースの無駄遣いを防ぐ。
    *   Horizontal Pod Autoscaler (HPA) を利用して、CPU使用率やメモリ使用量に応じてPodの数を自動的に調整する。
    *   Vertical Pod Autoscaler (VPA) を利用して、Podのリソースリクエストとリミットを自動的に調整する。

*   **オートスケーリング:** Horizontal Pod Autoscaler (HPA) を利用して、CPU使用率やメモリ使用量に応じてPodの数を自動的に調整する。
    *   Kubernetes Event-driven Autoscaling (KEDA) を利用して、イベントに応じてPodの数を自動的に調整する。

*   **スポットインスタンス活用:** Amazon EC2 スポットインスタンスなどの安価なインスタンスタイプを活用する。
    *   KubernetesのTaints and Tolerations機能を利用して、特定のPodをスポットインスタンスにのみ配置する。
    *   Karpenterなどのツールを利用して、スポットインスタンスのプロビジョニングを自動化する。

これらのテクニックを適用する際には、必ず効果測定を行い、コスト削減効果を確認してください。OpenCostとDatadogのダッシュボードを利用することで、効果測定を容易に行うことができます。

以下は、HPAの設定例です。

```yaml
apiVersion: autoscaling/v2beta2
kind: HorizontalPodAutoscaler
metadata:
  name: my-app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: my-app-deployment
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

この設定では、`my-app-deployment` というDeploymentのPod数を、CPU使用率が70%を超える場合に自動的にスケールアウトします。

## 7. トラブルシューティングと注意点: OpenCostとDatadog連携でよくある問題とその解決策 - データ欠損、パフォーマンス問題、権限設定

OpenCostとDatadog連携でよくある問題とその解決策を以下に示します。

*   **データ欠損:** OpenCostからDatadogにメトリクスが送信されない場合、以下の点を確認してください。
    *   Datadog Agentの設定が正しいか
    *   OpenCostのURLが正しいか
    *   Datadog AgentがOpenCostにアクセスできるか
    *   OpenCostのPodが正常に動作しているか

*   **パフォーマンス問題:** OpenCostのUIの表示が遅い場合、以下の点を確認してください。
    *   OpenCostのリソースリクエストとリミットが適切か
    *   OpenCostが動作するノードのリソースが不足していないか
    *   OpenCostのストレージが十分な性能を持っているか

*   **権限設定:** OpenCostがKubernetes APIにアクセスできない場合、以下の点を確認してください。
    *   OpenCostのServiceAccountに適切な権限が付与されているか
    *   OpenCostのPodがKubernetes APIにアクセスできるネットワーク設定になっているか

OpenCostのログを確認することで、問題の原因を特定できる場合があります。

```bash
kubectl logs -n opencost <opencost-pod-name>
```

## 8. まとめ: OpenCostとDatadogで継続的なコスト最適化を実現する

OpenCostとDatadogを連携させることで、Kubernetes環境のコストを可視化し、最適化することができます。本記事で紹介したテクニックを実践し、継続的なコスト最適化に取り組みましょう。

**参考リンク:**

*   OpenCost: [https://www.opencost.io/](https://www.opencost.io/)
*   Datadog: [https://www.datadoghq.com/](https://www.datadoghq.com/)
*   Helm: [https://helm.sh/](https://helm.sh/)
*   Horizontal Pod Autoscaler: [https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/)
*   Vertical Pod Autoscaler: [https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler)
*   Kubernetes Event-driven Autoscaling (KEDA): [https://keda.sh/](https://keda.sh/)
*   Karpenter: [https://karpenter.sh/](https://karpenter.sh/)

継続的なコスト最適化は、ビジネスの成長に不可欠です。OpenCostとDatadogを活用して、クラウドコストをコントロールし、より効率的なシステム運用を実現しましょう。
