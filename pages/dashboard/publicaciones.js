import { useSession } from "next-auth/client";
import { Router, useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";
import Layout from "../../components/Layout";
import styles from "../../styles/publications.module.scss";
import { graphQLClient } from "../../lib/graphql-client";
import Link from "next/link";
import styled from "styled-components";
import { Space, Table, Tag } from "antd";
import "antd/dist/antd.css";
import { DeleteOutlined } from "@ant-design/icons";
import { gql } from "graphql-request";

const Publications = () => {
  const [session, loading] = useSession();
  const router = useRouter();
  const [dataset, setDataset] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // useEffect(() => {
  //   const fetchData = () => {
  //     setIsLoading(true);

  //     const query = gql`
  //       query getUserByAuthID($id: ID!) {
  //         findUserByID(id: $id) {
  //           _id
  //           email
  //           posts {
  //             data {
  //               _id
  //               title
  //               excerpt
  //               content {
  //                 type
  //                 data {
  //                   items
  //                   file {
  //                     url
  //                   }
  //                   withBorder
  //                   text
  //                   style
  //                   stretched
  //                   caption
  //                   withBackground
  //                 }
  //               }
  //               tags {
  //                 tag
  //               }
  //               created_at
  //               slug
  //             }
  //           }
  //         }
  //       }
  //     `;
  //     const variables = {
  //       id: session?.id,
  //     };

  //     graphQLClient
  //       .request(query, variables)
  //       .then((output) => {
  //         if (output && output?.findUserByID?.posts.data.length > 0) {
  //           setDataset(
  //             output?.findUserByID?.posts.data.map((item) => {
  //               return {
  //                 key: item._id,
  //                 id: item._id,
  //                 titulo: item.title,
  //                 fecha: item.created_at.split("-").reverse().join("-"),
  //                 slug: item.slug,
  //               };
  //             })
  //           );
  //         }
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       })
  //       .finally(() => {
  //         setIsLoading(false);
  //       });
  //   };
  //   if (session && session.id !== undefined) {
  //     fetchData();
  //   }
  // }, [session && session.id]);

  const fetcher = (query, variables) =>
    graphQLClient.request(query, {
      id: session?.id ?? "",
    });

  const { data, error } = useSWR(
    mounted
      ? `query getUserByAuthID($id: ID!) {
      findUserByID(id: $id) {
              _id
              email
              posts {
                data {
                  _id
                  title
                  excerpt
                  content {
                    type
                    data {
                      items
                      file {
                        url
                      }
                      withBorder
                      text
                      style
                      stretched
                      caption
                      withBackground
                    }
                  }
                  tags {
                    tag
                  }
                  created_at
                  slug
                }
              }
            }
          }`
      : null,
    fetcher
  );

  useEffect(() => {
    if (session && session.id !== undefined) {
      setMounted(true);
    }
  }, [session]);
  useEffect(() => {
    if (data && data?.findUserByID?.posts.data.length > 0) {
      setDataset(
        data?.findUserByID?.posts.data.map((item) => {
          return {
            key: item._id,
            id: item._id,
            titulo: item.title,
            fecha: item.created_at.split("-").reverse().join("-"),
            slug: item.slug,
          };
        })
      );
    }
  }, [data]);

  const dataSource = [
    {
      key: "1",
      name: "Mike",
      age: 32,
      address: "10 Downing Street",
    },
    {
      key: "2",
      name: "John",
      age: 42,
      address: "10 Downing Street",
    },
  ];
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "SLUG",
      dataIndex: "slug",
      key: "slug",
    },
    {
      title: "Titulo",
      dataIndex: "titulo",
      key: "titulo",
      render: (text, record) => (
        <Space size="middle">
          <Tag color="#108ee9">{text}</Tag>
        </Space>
      ),
    },
    {
      title: "Fecha creación",
      dataIndex: "fecha",
      key: "fecha",
    },
    {
      title: "Acciones",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Link
            href={`/dashboard/publicaciones/${encodeURIComponent(record.id)}`}
          >
            <a>Ver Publicación</a>
          </Link>
          <DeleteOutlined
            style={{ color: "tomato" }}
            onClick={() => console.log(record.id)}
          />
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <Layout>
        <h1>Loading..</h1>
      </Layout>
    );
  }
  if (!session) {
    router.push("/");
    return (
      <Layout>
        <h1>Loading..</h1>
      </Layout>
    );
  }

  return (
    <Layout grid={"publications"}>
      <MockHeader>
        <h2> Publicaciones</h2>
        <Button> Crear artículo</Button>
      </MockHeader>
      <SideMenu></SideMenu>
      <Content>
        {/* {error ? <h2> Error </h2> : !data && <h2> loading data...</h2>} */}
        <Table
          dataSource={dataset.reverse()}
          columns={columns.filter(
            (item) => item.dataIndex !== "id" && item.dataIndex !== "slug"
          )}
        />
      </Content>
    </Layout>
  );
};

export default Publications;

export const Workbench = styled.div`
  height: 90vh;
`;

export const MockHeader = styled.div`
  grid-area: header;
  height: 12vh;
  padding: 1vw 2vw;
  background: #f7f9fa;
  border-bottom: 1px solid #c3cfd5;
  display: grid;
  align-items: center;
  grid-auto-flow: column;
  h2 {
    margin: 0;
  }
  button {
    width: fit-content;
    justify-self: end;
  }
`;
export const SideMenu = styled.div`
  grid-area: side;
  width: 100%;
  height: 100%;
  background: #f7f9fa;
  border-right: 1px solid #c3cfd5;
`;
export const Content = styled.div`
  background: white;
  grid-area: content;
  width: 100%;
  padding: 2vw;
  overflow-y: auto;
  height: 100%;
`;
export const Button = styled.button`
  transition: 0.2s;
  cursor: pointer;
  background: dodgerblue;
  border: none;
  padding: 5px 20px;
  border-radius: 5px;
  color: white;
  font-weight: 600;
  font-family: "Inter", sans-serif;
  user-select: none;
  outline: none;
  &:hover {
    background: #0c6adc;
  }
`;
